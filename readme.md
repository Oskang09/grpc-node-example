# Sequelize Migration

Only create migration scripts after released. For current just remove db and re-create.

# Task

```
Model CRUD

1. admin can create company
2. admin can create another admin
3. admin can crud public holiday
4. admin can create employee for company with permission
5. employee can create another employee with lower permission level 
6. employee with specified permission can run payroll
7. employee with specified permission can approve leave
8. employee with specified permission can submit leave for employee
9. employee can submit leave for getting approved 

Permission level by default come with 

1. company employee
2. branch employee
3. employee 


Permission node design sample

1. employee.payroll.*
2. employee.payroll.{branch_name}
3. admin.create_company
4. admin.create_employee
```