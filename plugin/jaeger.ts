import { initTracer } from 'jaeger-client';
import { initGlobalTracer } from 'opentracing';
import { ENV_JAEGER_HOST, ENV_JAEGER_PORT } from '../src/constant/env';

export default async function () {
    const config = {
        serviceName: "user-service",
        sampler: {
            type: "const",
            param: 1,
        },
        reporter: {
            logSpans: true,
            agentHost: ENV_JAEGER_HOST,
            agentPort: Number.parseInt(ENV_JAEGER_PORT, 10),
        }
    };
    const opts = {};
    initGlobalTracer(initTracer(config, opts));
}