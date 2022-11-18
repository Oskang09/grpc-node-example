export let ENV_DATABASE_NAME: string;
export let ENV_DATABASE_PASSWORD: string;
export let ENV_DATABASE_USERNAME: string;
export let ENV_TOKEN_SECRET: string;
export let ENV_DATABASE_HOST: string;
export let ENV_DATABASE_PORT: string;
export let ENV_JAEGER_HOST: string;
export let ENV_JAEGER_PORT: string;
export let ENV_KUBEMQ_HOST: string;
export let ENV_KUBEMQ_PORT: string;

export function init() {
    ENV_DATABASE_HOST = process.env.DATABASE_HOST!;
    ENV_DATABASE_PORT = process.env.DATABASE_PORT!;
    ENV_DATABASE_USERNAME = process.env.DATABASE_USERNAME!;
    ENV_DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
    ENV_DATABASE_NAME = process.env.DATABASE_NAME!;
    ENV_JAEGER_HOST = process.env.JAEGER_AGENT_HOST!;
    ENV_JAEGER_PORT = process.env.JAEGER_AGENT_PORT!;
    ENV_TOKEN_SECRET = process.env.TOKEN_SECRET!;
    ENV_KUBEMQ_HOST = process.env.KUBEMQ_HOST!;
    ENV_KUBEMQ_PORT = process.env.KUBEMQ_PORT!;
}