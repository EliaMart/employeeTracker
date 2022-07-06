const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');
const mysql = require('mysql2');


connection.connect(err => {
    if(err) {
        console.log(err)
    }

    renderQuestions();

});



const renderQuestions = () => {
    inquirer.prompt  ([
        {
            type: 'list',
            name: 'questionSelection',
            message: "What would you like to do? Select from the following",
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
    ])
    .then(response => {
        if (response.selection === 'Exit') {
            connection.end();
            console.log(Goodbye);
    }

        if(response. selection === 'View All Departments') {

            const sql = `SELECT department.id AS 'ID', 
                        department.department_name AS 'Department' FROM department`

            connection.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.table(rows);
                renderQuestions();
            })
        };


        if (response.selection === 'View All Roles') {

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
        }

        if (response.selection === 'View All Employees') {

            const sql = `SELECT employee.id AS 'ID', 
                        employee.first_name AS 'First Name', 
                        employee.last_name AS 'Last Name',
                        roles.title AS 'Title',
                        department.department_name AS 'Department',
                        roles.salary AS 'Salary',
                        CONCAT (manager.first_name, ' ', manager.last.name) AS 'Manager',

                        FROM employee
                        
                        LEFT JOIN roles ON (employee.roles_id = roles.id)
                        LEFT JOIN department ON (department.id = roles.department_id)
                        LEFT JOIN employee manager ON employee.manager_id = manager.id;`

            connection.query(sql, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.table(rows);
                renderQuestions();
            })
        }

        if(response.selection === 'Add Department') {
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
        };

        if (response.selection === 'Add Role') {
            
            const sql = `SELECT * FROM department`;

            connection.query(sql, (err, data) => {
                if(err) {
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
        }

        if(response.selection === 'Add Employee') {

        }
})

};