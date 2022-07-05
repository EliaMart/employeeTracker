const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');
const mysql = require('mysql2');
const connection = require('./config/connection');


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
                        department.department_name AS 'Department' FROM department;`

            connection.query(sql, (err, rows) => {
                if(err) {
                    console.log(err)
                }
                console.table(rows);
                renderQuestions();
            })
        };


        if (response.selection === 'View All Roles') {

            const sql = `SELECT roles.id AS 'ID', 
                        roles.title AS 'Title, 
                        department.department_name AS 'Department',
                        roles.salary AS 'Salary'

                        FROM roles
                        
                        JOIN department ON roles.department_id = department.id`

            connection.query(sql, (err, rows) => {
                if(err) {
                    console.log(err)
                }
                console.table(rows)
                renderQuestions();
            })
        }
})
};