// @ts-nocheck

export default {
    employeeCreate: async () => {
        const query = {
            endpoint: 'createEmployee',
            payload: {
                email: "oskang@company.com",
                password: "oskang09",
                companyId: 1,
            }
        };
        const result = await request(query);
        return { request: query, response: result };
    }
};