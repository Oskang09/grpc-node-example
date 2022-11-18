import { Repository } from "sequelize-typescript";
import * as Bcrypt from 'bcrypt';

import { ServiceController, IRepository, Service } from "../../plugin/service";
import Employee, { EmployeeGender } from "../model/employee";
import { ErrUserDuplicateEmail, ErrUserNotFound } from "../constant/error";
import Admin from "../model/admin";

class EmployeeController extends ServiceController {

    @IRepository(Admin)
    adminRepository: Repository<Admin>

    @IRepository(Employee)
    employeeRepository: Repository<Employee>

    @Service("createEmployee")
    async createEmployee(body: object) {
        const request = this.validate(body, {
            email: "required|email",
            password: "required|alpha_num|max:20",
            companyId: 'required|numeric',
        });

        const query = { where: { email: request.email } };
        const isExist = await this.adminRepository.findOne(query) || await this.employeeRepository.findOne(query);
        if (isExist) {
            throw ErrUserDuplicateEmail
        }

        const hash = await Bcrypt.hash(request.password, 8);
        const employee = await this.employeeRepository.create({
            email: request.email,
            password: hash,
            companyId: request.companyId,
        });
        return employee;
    }

    @Service("findEmployeeById")
    async findEmployeeById(body: object) {
        const request = this.validate(body, {
            id: "required|string"
        });

        const employee = await this.employeeRepository.findByPk(request.id);
        if (!employee) {
            throw ErrUserNotFound
        }
        return employee;
    }

    @Service("removeEmployee")
    async removeEmployee(body: object) {
        const request = this.validate(body, {
            id: "required|string"
        });

        const employee = await this.employeeRepository.findByPk(request.id);
        if (!employee) {
            throw ErrUserNotFound
        }
        await employee.destroy();
        return employee;
    }
}

export default EmployeeController;