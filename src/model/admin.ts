
import { Model, Table, Column, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { validator } from 'sequelize/types/lib/utils/validator-extras';

@Table({
    modelName: 'admin',
    tableName: 'admins',
    timestamps: true,
    freezeTableName: true,
    defaultScope: {
        attributes: {
            exclude: ['password']
        }
    }
})
class Admin extends Model {

    @Column({
        type: DataType.STRING(20),
        primaryKey: true,
    })
    id: string

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

    @Column({
        type: DataType.JSONB,
        validate: {
            isArray: true,
        }
    })
    permissions: string[]

    @Column({ type: DataType.INTEGER })
    roleId: number

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date
}

export default Admin;