const inquirer = require('inquirer');


const optionsList = () => {
    inquirer.prompt  ([
        {
            type: 'list',
            name: 'options',
            message: "What would you like to do?",
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Deaprtments',
                'Add Department',
                'Quit'
            ]
        },
    ])
    .then((teamRole) => {
        if (teamRole.role === 'Engineer') {
            engineerQuestions();
        } else if (teamRole.role === 'Intern') {
            internQuestions();
        } else {
            generateIndex(infoArr);
        }
    })
};