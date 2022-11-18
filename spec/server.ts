// @ts-nocheck

import 'reflect-metadata';

import * as path from 'path';
import * as glob from 'glob';
import * as dotenv from 'dotenv';

import sequelize from '../plugin/sequelize';
import service from '../plugin/service';

async function bootstrap() {

    dotenv.config({ path: path.join(__dirname, `../env/test.env`) });
    const env = await import('../src/constant/env');
    env.init();

    const db = await sequelize(true);
    await db.sync();
    global.request = await service({ sequelize: db });

    const example = {};
    for (const file of glob.sync("./**/*.spec.ts", { cwd: __dirname })) {
        Object.assign(example, require(file).default);
    }

    process.stdin.on('data', async (text) => {
        const target = text.toString('utf8').trimEnd();
        const fn = example[target];
        console.clear();
        if (!fn) {
            process.stdout.write("Example '" + target + "' doesn't exists, available example:\n");
            console.dir(Object.keys(example));
            console.log("");
        } else {
            const { request, response } = await fn();
            console.log("Service: " + target);
            console.log("");
            console.log("Request:");
            console.log("");
            console.dir(request);
            console.log("");
            console.log("Response:");
            console.log("");
            console.dir(JSON.parse(response));
            console.log("");
        }
        process.stdout.write("What service example you want to view?\n> ");
    });

    console.clear();
    process.stdout.write("What service example you want to view?\n> ");
}

bootstrap();