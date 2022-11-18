import { Repository } from "sequelize-typescript";
import * as Jwt from 'jsonwebtoken';
import * as Bcrypt from 'bcrypt';

import { ServiceController, IRepository, Service } from "../../plugin/service";
import Admin from "../model/admin";
import Employee from "../model/employee";
import { ENV_TOKEN_SECRET } from "../constant/env";
import { ErrUserInvalidPassword, ErrUserNotFound } from "../constant/error";
import Role from "../model/role";

type Token = {
    type: string,
    id: string | number,
};

class TokenController extends ServiceController {

    @IRepository(Admin)
    adminRepository: Repository<Admin>

    @IRepository(Employee)
    employeeRepository: Repository<Employee>

    @IRepository(Role)
    roleRepository: Repository<Role>

    @Service("login")
    async login(body: object) {
        const request = this.validate(body, {
            email: 'required|email',
            password: 'required|alpha_num|max:20',
        });

        const query = { where: { email: request.email } };
        const user = await this.adminRepository.findOne(query) || await this.employeeRepository.findOne(query);
        if (!user) {
            throw ErrUserNotFound
        }

        const compare = await Bcrypt.compare(request.password, user.password);
        if (!compare) {
            throw ErrUserInvalidPassword
        }

        const payload: Token = {
            type: user instanceof Admin ? "ADMIN" : "EMPLOYEE",
            id: user.id,
        };
        const token = Jwt.sign(payload, ENV_TOKEN_SECRET, {
            expiresIn: '7d',
            issuer: "amantiq",
            subject: user.id.toString(),
            audience: "user-service",
        });

        return { user, token };
    }

    @Service("inspectToken")
    async inspectToken(body: object) {
        const request = this.validate(body, {
            token: 'required',
        });

        const decoded = Jwt.verify(request.token, ENV_TOKEN_SECRET, {
            issuer: "amantiq",
            audience: "user-service",
        }) as Token;

        const user = await (decoded.type === "ADMIN" ? this.adminRepository.findByPk(decoded.id) : this.employeeRepository.findByPk(decoded.id));
        if (!user) {
            throw ErrUserNotFound
        }

        if (user.roleId != null) {
            const role = await this.roleRepository.findByPk(user.roleId);
            if (role == null) {
                throw ErrUserNotFound;
            }
            user.permissions.push(...role.permissions);
        }
        return { type: decoded.type, user };
    }
}

export default TokenController;