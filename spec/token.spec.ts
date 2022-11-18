// @ts-nocheck

export default {
    userLogin: async () => {
        const create = {
            endpoint: 'createEmployee',
            payload: {
                email: "test-employee@company.com",
                password: "oskang09",
                companyId: 1,
            }
        };
        await request(create);

        const login = {
            endpoint: 'login',
            payload: {
                email: "test-employee@company.com",
                password: "oskang09",
            }
        };
        const result = await request(login);
        return { request: login, response: result };
    },
    inspectToken: async () => {
        await request({
            endpoint: 'createEmployee',
            payload: {
                email: "test-employee@company.com",
                password: "oskang09",
                companyId: 1,
            }
        });

        const loginRes = await request({
            endpoint: 'login',
            payload: {
                email: "test-employee@company.com",
                password: "oskang09",
            }
        });
        const { result: { token } } = JSON.parse(loginRes);

        const inspect = {
            endpoint: 'inspectToken',
            payload: { token },
        };
        const result = await request(inspect);
        return { request: inspect, response: result };
    }
};