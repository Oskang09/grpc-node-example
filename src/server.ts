import 'reflect-metadata';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as Umzug from 'umzug';
import * as fs from 'fs';
import { QueryReceiver } from 'kubemq-nodejs';

import sequelize from '../plugin/sequelize';
import service, { ServiceRequest } from '../plugin/service';
import jaeger from '../plugin/jaeger';
import { ENV_DATABASE_HOST, ENV_DATABASE_NAME, ENV_DATABASE_PASSWORD, ENV_DATABASE_PORT, ENV_DATABASE_USERNAME, ENV_JAEGER_HOST, ENV_JAEGER_PORT, ENV_KUBEMQ_HOST, ENV_KUBEMQ_PORT } from './constant/env';

const { QueryResponse } = QueryReceiver;

export interface KubeMQQuery {
    Tags: Map<string, string>;
    RequestID: string;
    RequestTypeData: string;
    ClientID: string;
    Channel: string;
    Metadata: string;
    Body: Buffer,
    ReplyChannel: string;
    Timeout: number;
    CacheKey: string;
    CacheTTL: number;
    Span: Buffer;
};

async function bootstrap() {

    dotenv.config({
        path: path.join(__dirname, `../env/${process.env.ENVIRONMENT || 'development'}.env`)
    });
    const env = await import('./constant/env');
    env.init();

    await jaeger();
    const setting = {
        ip: ENV_KUBEMQ_HOST,
        port: ENV_KUBEMQ_PORT,
        clientId: 'user-service', // increment to user-service-1 when using loadbalancer
        group: 'user-service',    // prevent loadbalancer run same request twice
        channel: 'user-service',  // receive request that is send to this channel
        timeout: 30000,
    };
    const server = new QueryReceiver(setting.ip, setting.port, setting.clientId, setting.channel, setting.group, setting.timeout);
    const db = await sequelize();

    const migrator = new Umzug({
        storage: "sequelize",
        storageOptions: { sequelize: db },
        migrations: {
            path: './migration',
            params: [db.getQueryInterface()],
        }
    });
    const query = await service({ sequelize: db, umzug: migrator });
    server.subscribe(async (req: KubeMQQuery) => {
        const body: ServiceRequest = JSON.parse(req.Body.toString('utf8'));
        const res = await query(req, body);
        const response = new QueryResponse(req, Buffer.from(res));
        await server.sendResponse(response);
    }, console.error);

    const signature = fs.readFileSync(path.join(__dirname, "../signature.txt"), 'utf8');
    console.log(signature);
    console.log("|————————————————|——————————————————————————————————————————————————————————————————————————————————————————————|");
    console.log("|  1. Jaeger     | " + ENV_JAEGER_HOST + ":" + ENV_JAEGER_PORT);
    console.log("|  2. KubeMQ     | " + ENV_KUBEMQ_HOST + ":" + ENV_KUBEMQ_PORT);
    console.log("|  3. PostgreSQL | " + ENV_DATABASE_HOST + ":" + ENV_DATABASE_PORT + "@" + ENV_DATABASE_USERNAME + ":" + ENV_DATABASE_PASSWORD + "/" + ENV_DATABASE_NAME);
    console.log("|————————————————|——————————————————————————————————————————————————————————————————————————————————————————————|");
}

bootstrap().catch(console.error);
