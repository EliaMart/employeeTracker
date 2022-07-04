const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_USER
    }
);

module.exports = connection;