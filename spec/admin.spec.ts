// @ts-nocheck

export default {
    adminCreate: async () => {
        const query = {
            endpoint: 'createAdmin',
            payload: {
                email: "oskang@amantiq.com",
                password: "oskang09"
            }
        };
        const result = await request(query);
        return { request: query, response: result };
    },
};