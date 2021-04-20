const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Password11!",
  database: "employee_db",
});

const runApp = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What do you want to do?",
      choices: [
        "View Employees",
        "View Department",
        "View Reports",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Role",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View Employees":
          viewEmployees();
          break;
        case "View Department":
          viewDepartment();
          break;
        case "View Manager":
          viewManager();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Role":
          updateRole();
          break;
        default:
          console.log(`Invalid Action: ${answer.action}`);
          break;
      }
    });
};

// Display all employees in a table and run app again
const viewEmployees = () => {
  connection.query("SELECT * FROM employees", (err, data) => {
    if (err) throw err;
    console.table(data);
    runApp();
  });
};

// Add a new department to the database
const addDepartment = () => {
  inquirer
    .prompt({
      name: "title",
      type: "input",
      message: "New department name:",
    })
    .then((answer) => {
      connection.query(
        `INSERT INTO departments (title) VALUES ("${answer.title}")`,
        (err, data) => {
          if (err) throw err;
          console.log("New department added!");
          runApp();
        }
      );
    });
};

// Add a new role to the database using prompts
const addRole = () => {
  inquirer
    .prompt(
      {
        name: "title",
        type: "input",
        message: "New role name:",
      },
      {
        name: "salary",
        type: "input",
        message: "New role salary (USD):",
      },
      {
        name: "department",
        type: "input",
        message: "New role department ID:",
      }
    )
    .then((answers) => {
      connection.query(
        `INSERT INTO roles (title, salary, department_id) VALUES ("${answers.title}", ${answers.salary}, ${answers.department})`,
        (err, data) => {
          if (err) throw err;
          console.log("New role added!");
          runApp();
        }
      );
    });
};

// Connect to the database and start app
connection.connect((err) => {
  if (err) throw err;
  console.log("Connection Thread ID: ", connection.threadId);
  runApp();
});

// connection.end();
