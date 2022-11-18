import { Sequelize, ModelCtor } from 'sequelize-typescript';
import { glob } from 'glob';
import { ENV_DATABASE_USERNAME, ENV_DATABASE_PASSWORD, ENV_DATABASE_NAME, ENV_DATABASE_HOST, ENV_DATABASE_PORT } from '../src/constant/env';

export default async function (test: boolean = false) {
    const models: ModelCtor[] = [];
    for (const file of glob.sync('../src/model/**.ts', { cwd: __dirname })) {
        const model: ModelCtor = require(file).default;
        models.push(model);
    }

    let sequelize: Sequelize;
    if (!test) {
        // @ts-ignore
        sequelize = new Sequelize({
            models,
            logging: false,
            dialect: 'postgres',
            schema: 'user-service',
            host: ENV_DATABASE_HOST,
            port: ENV_DATABASE_PORT,
            username: ENV_DATABASE_USERNAME,
            password: ENV_DATABASE_PASSWORD,
            database: ENV_DATABASE_NAME,
            repositoryMode: true,
        });
    } else {
        sequelize = new Sequelize({
            models,
            logging: false,
            dialect: 'sqlite',
            storage: ':memory:',
            repositoryMode: true,
        });
    }

    await sequelize.authenticate();
    return sequelize
};