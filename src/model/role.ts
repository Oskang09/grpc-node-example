import { Model, Table, Column, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
    modelName: 'role',
    tableName: 'roles',
    timestamps: true,
    freezeTableName: true,
})
class Role extends Model {

    @Column({
        type: DataType.STRING(20),
        primaryKey: true,
    })
    id: string

    @Column({ type: DataType.INTEGER })
    level: number

    @Column({
        type: DataType.JSONB,
        validate: {
            isArray: true,
        }
    })
    permissions: string[]

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date
}

export default Role;