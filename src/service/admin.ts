import { Repository } from "sequelize-typescript";
import * as Bcrypt from 'bcrypt';

import { ServiceController, IRepository, Service } from "../../plugin/service";
import Admin from "../model/admin";
import { ErrUserDuplicateEmail, ErrUserNotFound } from "../constant/error";
import { generateUNIQ } from "../util/generator";
import Employee from "../model/employee";

class AdminController extends ServiceController {

    @IRepository(Admin)
    adminRepository: Repository<Admin>

    @IRepository(Employee)
    employeeRepository: Repository<Employee>

    @Service("createAdmin")
    async createAdmin(body: object) {
        const request = this.validate(body, {
            email: "required|email",
            password: "required|alpha_num|max:20",
        });

        const query = { where: { email: request.email } };
        const isExist = await this.adminRepository.findOne(query) || await this.employeeRepository.findOne(query);
        if (isExist) {
            throw ErrUserDuplicateEmail
        }

        const hash = await Bcrypt.hash(request.password, 8);
        const admin = await this.adminRepository.create({
            id: generateUNIQ(),
            email: request.email,
            password: hash,
        });
        return admin;
    }

    @Service("findAdminById")
    async findAdminById(body: object) {
        const request = this.validate(body, {
            id: "required|string"
        });

        const admin = await this.adminRepository.findByPk(request.id);
        if (!admin) {
            throw ErrUserNotFound
        }
        return admin;
    }

    @Service("removeAdmin")
    async removeAdmin(body: object) {
        const request = this.validate(body, {
            id: "required|string"
        });

        const admin = await this.adminRepository.findByPk(request.id);
        if (!admin) {
            throw ErrUserNotFound
        }

        await admin.destroy();
        return admin;
    }
}

export default AdminController;