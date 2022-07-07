const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');

connection.connect(err => {
    if (err) {
        console.log('Error:', err);
    }
    renderQuestions();
});

// Questions for adding and updating 

const renderQuestions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'questionSelection',
            message: "What would you like to do? Select from the following:",
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'
            ]
        },
    ]).then(response => {
        if (response.questionSelection === 'Exit') {
            connection.end();
            console.log('Goodbye');
        } else if (response.questionSelection === 'View All Departments') {

            const sql = `SELECT department.id AS 'ID', 
                        department.department_name AS 'Department' FROM department`

            connection.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                console.table(rows);
                renderQuestions();
            })
        } else if (response.questionSelection === 'View All Roles') {
            const sql = `SELECT roles.id AS 'ID', 
                        roles.title AS 'Title', 
                        department.department_name AS 'Department',
                        roles.salary AS 'Salary'

                        FROM roles
                        
                        JOIN department ON roles.department_id = department.id`;
            connection.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.table(rows);
                renderQuestions();
            })
        } else if (response.questionSelection === 'View All Employees') {
            console.log('View All Employees');
            // const sql = `SELECT employee.id AS 'ID', 
            //             employee.first_name AS 'First Name', 
            //             employee.last_name AS 'Last Name',
            //             roles.title AS 'Title',
            //             department.department_name AS 'Department',
            //             roles.salary AS 'Salary',
            //             CONCAT (manager.first_name, ' ', manager.last.name) AS 'Manager',

            //             FROM employee
                        
            //             LEFT JOIN roles ON (employee.roles_id = roles.id)
            //             LEFT JOIN department ON (department.id = roles.department_id)
            //             LEFT JOIN employee manager ON employee.manager_id = manager.id;`
            const sql = `select * from employee`;
            connection.query(sql, (err, rows) => {
                if (err) {
                    console.log('Error:', err);
                }
                console.table('Rows:', rows);
                renderQuestions();
            })
        } else if (response.questionSelection === 'Add Department') {
            inquirer.prompt ([
                {
                    type: 'input',
                    name: 'deptName',
                    message: 'Enter Department Name'
                }

            ])
            .then(answer => {
                const sql = `INSERT INTO department (department_name) VALUES ('${answer.deptName}')`;
                connection.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`${answer.deptName} added`);
                    renderQuestions();
                });
            })
        } else if (response.questionSelection === 'Add Role') {
            const sql = `SELECT * FROM department`;
            connection.query(sql, (err, data) => {
                if (err) {
                    console.log(err)
                }
                const dept = data.map(({ id, department_name }) => ({ name: department_name, value: id}))
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter Role'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter salary for the specifed role'
                    },
                    {
                        type: 'list',
                        name: 'newDept',
                        message: 'Which department does this role belong to?',
                        choices: dept
                    }
                ])
                .then(answer => {
                    const { title, salary, newDept } = answer;

                    const sqlAnswers = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salary}', '${newDept}')`;

                    connection.query(sqlAnswers, (err) => {
                        if (err) {
                            console.log(err);
                        }

                        console.log(`${title} added`);
                        renderQuestions();
                    });
                })
            })
        } else if (response.questionSelection === 'Add Employee') {
            const sqlRole = `SELECT * FROM roles`;

            connection.query(sqlRole, (err, data) => {
                if (err) {
                    console.log(err);
                }
                const roles = data.map(({ id, title, salary, department_id }) => ({ name: title, salary: salary, department: department_id, value: id}));

                const employeeArr =[];

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the first name of the employee'
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the last name of the employee'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: roles
                    }
                ])
                .then(answers => {
                    employeeArr.push(answers.firstName, answers.lastName, answers.role);

                    const sqlMan = `SELECT * FROM employee`;

                    connection.query(sqlMan, (err, data) => {
                        if (err) {
                            console.log(err);
                        }

                        const managers = data.map(({id, first_name, last_name}) =>({ name: first_name + " " + last_name, value: id}));

                        inquirer.prompt ([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Enter the employee's manager",
                                choices: managers
                            }
                        ])
                        .then(managerAnswers =>{
                            const manager = managerAnswers.manager;
                            employeeArr.push(manager);

                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', '${answers.role}', ${manager})`;

                            connection.query(sql, employeeArr, (err, result) => {
                                if(err) {
                                    console.log(err);
                                }
                                console.log(`Employee Added`)
                                renderQuestions();
                            });
                        })
                    })
                })
            })
        } else if (response.questionSelection === 'Update Employee Role') {
            const sql = `SELECT * FROM employee`;
            connection.query(sql, (err, data) => {
                if (err) {
                    console.log(err)
                }
                const employees = data.map (({id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

                inquirer.prompt ([
                    {
                        type: 'list',
                        name: 'updatedEmployee',
                        message: 'Pick an employee to update',
                        choices: employees
                    }
                 ]).then(answer => {
                    const employee = answer.updatedEmployee;
                    const arr = [];
                    arr.push(employee);

                    const sqlRole = `SELECT * FROM roles`;

                    connection.query(sqlRole, (err, data) => {
                        if (err) {
                            console.log(err)
                        }

                        const role = data.map(({ id, title}) => ({name: title, value: id }));

                        inquirer.prompt ([
                            {
                            type: 'list',
                            name: 'newRole',
                            message: 'Pick a new role for the employee',
                            choices: role
                            }
                        ])
                        .then(roleAnswer => {
                            const role = roleAnswer.newRole;
                            arr.push(role);

                            const reverseArr = arr.reverse();

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`

                            connection.query(sql, reverseArr, (err, results) => {
                                if(err) {
                                    console.log(err)
                                }
                                console.log(`Employee Updated`);
                                renderQuestions();
                            })
                        })
                    })
                })
            })
        }
    }) 
};
