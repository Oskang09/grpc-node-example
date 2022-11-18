import { ServiceController, Service } from "../../plugin/service";

class BasicController extends ServiceController {

    @Service("health")
    health() {
        return true;
    }

    @Service("migration")
    async migration() {
        // Temporary development using this
        await this.sequelize.sync({ alter: true });
        // await this.umzug.up();
        return null;
    }

}

export default BasicController;