const mysql = require('mysql');
const inquirer = require('inquirer');
const { start } = require('node:repl');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Password11!',
    database: 'amazon'
});

const startApp = () => {
    inquirer.prompt({
        name: 'readInfo',
        type: 'message',
        message: 'Type READ to see what the amazon database looks like.'
    }).then((answer) => {
        console.log(answer.readInfo);
        // TODO: add database name in string below
        connection.query('SELECT * FROM ', (err, results) => {
            if (err) throw err;
            console.log(results);
        })
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log('Did I connect to the database?', connection.threadId);
    startApp();
    connection.end();
})