import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { glob } from 'glob';
import { ErrMapper } from '../src/constant/error';
import * as Validator from 'validatorjs';
import { Umzug } from 'umzug';
import { FORMAT_TEXT_MAP, globalTracer, Span, Tracer } from 'opentracing';
import { KubeMQQuery } from '../src/server';

const REPOSITORY_METAKEY = "sequelize.repository";
const SERVICE_METAKEY = "service.kubemq";

interface ServiceOptions {
    path: string,
    handler?: (req: object) => any,
};

interface ServerContext {
    sequelize: Sequelize
    umzug: Umzug,
};

export interface ServiceRequest {
    endpoint: string;
    payload: any;
};

type ServiceResponse = string;
type ServiceCall = (query: KubeMQQuery, req: ServiceRequest) => Promise<ServiceResponse>;

interface RepositoryOptions {
    key: string,
    value: ModelCtor,
};

export class ServiceController {
    sequelize: Sequelize
    umzug: Umzug

    constructor(ctor: ServerContext) {
        this.sequelize = ctor.sequelize;
        this.umzug = ctor.umzug;
    }

    validate<T extends Validator.Rules>(body: object, rules: T): { [K in keyof T]: any } {
        const parsedBody = body as { [K in keyof T]: any };
        const validation = new Validator(body, rules);
        if (validation.fails()) {
            throw validation.errors.all();
        }
        return parsedBody;
    }

    // traceLog(body: object) {
    //     const tracer = globalTracer();
    //     tracer.extract(FORMAT_TEXT_MAP, body);
    // }
};

export function IRepository(model: ModelCtor) {
    return (target: any, propertKey: string) => {
        let metadata: RepositoryOptions[] = Reflect.getMetadata(SERVICE_METAKEY, target);
        if (!metadata) {
            metadata = []
        }
        metadata.push({ key: propertKey, value: model });
        Reflect.defineMetadata(REPOSITORY_METAKEY, metadata, target);
    }
};

export function Service(opt: ServiceOptions | string) {
    return (target: ServiceController, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof opt === 'string') {
            opt = { path: opt };
        }
        opt.handler = descriptor.value

        let metadata: ServiceOptions[] = Reflect.getMetadata(SERVICE_METAKEY, target);
        if (!metadata) {
            metadata = []
        }
        metadata.push(opt);
        Reflect.defineMetadata(SERVICE_METAKEY, metadata, target);
    }
};

export default async function (ctor: ServerContext): Promise<ServiceCall> {
    const routes: { [name: string]: (req: object) => void } = {};
    for (const file of glob.sync("../src/service/**.ts", { cwd: __dirname })) {
        const serviceClass = require(file).default;
        const service = new serviceClass(ctor);

        const metas: ServiceOptions[] = Reflect.getMetadata(SERVICE_METAKEY, service) || [];
        for (const meta of metas) {
            routes[meta.path] = meta.handler?.bind(service);
        }

        const repos: RepositoryOptions[] = Reflect.getMetadata(REPOSITORY_METAKEY, service) || [];
        for (const repo of repos) {
            service[repo.key] = ctor.sequelize.getRepository(repo.value);
        }
    }
    return async (query: KubeMQQuery, body: ServiceRequest) => {
        const route = routes[body.endpoint];
        const response = {};
        if (!route) {
            Object.assign(response, { error: "No service endpoint found." });
        } else {
            const tracer = globalTracer();
            const parentSpan = tracer.extract(FORMAT_TEXT_MAP, query.Tags);
            let span: Span;
            if (parentSpan != null) {
                span = tracer.startSpan(body.endpoint, { childOf: parentSpan });
            } else {
                span = tracer.startSpan(body.endpoint);
            }

            const requestObject = Object.assign({}, body.payload);
            span.log({ request: requestObject });
            span.setTag("request_id", query.RequestID);
            tracer.inject(span.context(), FORMAT_TEXT_MAP, body.payload);

            try {
                Object.assign(response, { result: await route(body.payload) });
            } catch (error) {
                let message = "";
                if (typeof error === 'object') {
                    message = Object.values(error).join(",");
                } else {
                    message = ErrMapper[error.message];
                }

                if (!message || message === "") {
                    span.log({ error: error.stack });
                    message = "Unhandled error: " + error.message;
                }
                Object.assign(response, { error: message });
            }
            span.log({ response });
            span.finish();
        }
        return JSON.stringify(response);
    }
};