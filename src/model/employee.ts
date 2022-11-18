import { Model, Table, Column, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Col } from 'sequelize/types/lib/utils';

@Table({
    modelName: 'employee',
    tableName: 'employees',
    timestamps: true,
    freezeTableName: true,
    indexes: [
        {
            fields: ['employeeNo', 'companyId'],
            unique: true,
        },
    ]
})
class Employee extends Model {

    @Column({
        type: DataType.STRING(20),
        primaryKey: true,
    })
    id: string

    @Column({ type: DataType.STRING })
    employeeNo: string

    @Column({
        type: DataType.STRING(20),
        primaryKey: true,
    })
    companyId: string

    @Column({
        type: DataType.STRING(20),
        primaryKey: true,
    })
    roleId: string

    @Column({
        type: DataType.JSONB,
        validate: {
            isArray: true,
        }
    })
    permissions: string[]

    @Column({
        type: DataType.STRING,
        validate: { max: 50 }
    })
    name: string

    @Column({
        type: DataType.STRING,
        unique: true,
        validate: { isEmail: true }
    })
    email: string

    @Column({ type: DataType.STRING })
    password: string

    @Column({ type: DataType.INTEGER })
    age: number

    @Column({ type: DataType.DATEONLY })
    dob: Date

    @Column({ type: DataType.STRING })
    gender: EmployeeGender

    @Column({ type: DataType.STRING })
    type: EmployeeType

    @Column({ type: DataType.STRING })
    status: EmployeeStatus

    @Column({ type: DataType.JSONB })
    nationality: EmployeeNationality

    @Column({ type: DataType.JSONB })
    working: EmployeeWorking

    @Column({ type: DataType.JSONB })
    designation: EmployeeDesignation

    @Column({ type: DataType.JSONB })
    financial: EmployeeFinancial

    @Column({ type: DataType.JSONB })
    family: EmployeeFamily

    @Column({ type: DataType.JSONB })
    satutory: EmployeeSatutory

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date
}


export enum EmployeeFamilyMartialStatus {
    SINGLE,
    MARRIED,
    DIVORCED,
    WIDOW
};

export interface EmployeeNationality {
    nationality: string,
    identityNo: string,
    religion: string,
    bumiputera: boolean
};

export interface EmployeeFamily {
    martialStatus: EmployeeFamilyMartialStatus,
    spouse: { name: string, nric: string, nationality: string, dob: string, working: boolean }[],
    children: { name: string, nric: string, nationality: string, dob: string, studying: boolean }[],
    dependent: { name: string, nric: string, nationality: string, dob: string }[],
};

export interface EmployeeSatutory {
    epf: { accountNo: string, isMalaysia: boolean, rate: number },
    socso: { accountNo: string },
    tax: { accountNo: string, taxResidence: boolean, rep: boolean, knowledgeWorker: boolean },
    zakat: { authority: string, type: 'percentage' | 'fixed', value: number }[],
};

export interface EmployeeContact {
    email: { type: string, value: string }[],
    phoneNumber: { type: string, value: string }[],
    emergency: { type: string, relation: string, value: string }[],
    address: {
        type: string,
        line1: string,
        line2: string,
        line3: string,
        country: string,
        state: string,
        city: string,
        postCode: string,
    }[],
};

export interface EmployeeFinancial {
    bankName: string,
    bankAccount: string,
    bankType: string,
    bankAccountName: string,
    insuranceName: string,
    insuranceAccount: string,
    insuranceType: string,
};

export interface EmployeeWorking {
    monday: string[2],
    tuesday: string[2],
    wednesday: string[2],
    thrusday: string[2],
    friday: string[2],
    saturday: string[2],
    sunday: string[2],
};

export interface EmployeeDesignation {
    title: string,
    grade: number,
    department: string,
    branch: number,
};

export enum EmployeeGender {
    MALE,
    FEMALE,
    OTHER
};

export enum EmployeeType {
    PART_TIME,
    FULL_TIME
};

export enum EmployeeStatus {
    CONFIRMED,
    RETIRED,
    LEAVED
};

export default Employee;