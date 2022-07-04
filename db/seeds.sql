INSERT INTO department (department_name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');


INSERT INTO roles (title, salary, department_id)
VALUES
    ('Salesperson', 50000, 4),
    ('Lawyer', 100000, 3),
    ('CPA', 100000, 2),
    ('Computer Enginner', 80000, 1),
    ('Investment Banker', 200000, 2),
    ('Chemical Enginner', 90000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 4, 5),
    ('Ashley', 'Smith', 2, 5),
    ('Sarah', 'Rodriguez', 3, 5),
    ('James', 'Bond', 5, NULL),
    ('Anakin', 'Skywalker', 6, 5),
    ('Hermione', 'Granger', 6, 5),
    ('Princess', 'Lea', 1, 5),
    ('Michelle', 'Walker', 3, 5),
    ('Ben', 'Smith', 1, 5);

