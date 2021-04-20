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

// Create a function to provide initial prompt and route to other functions
const runApp = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What do you want to do?",
      choices: [
        "View Employees",
        "View Department",
        "View Role",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Role",
        "Exit",
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
        case "View Role":
          viewRole();
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
        case "Exit":
          connection.end();
          break;
        default:
          console.log(`Invalid Action: ${answer.action}`);
          break;
      }
    });
};

// Display all employees in a table and run app again
const viewEmployees = () => {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.title, CONCAT(mgr.first_name,' ',mgr.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees mgr ON employees.manager_id = mgr.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      runApp();
    }
  );
};

// Display all employee in the same department
const viewDepartment = () => {
  // TODO: Add query to get department names
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Select department:",
      choices: ["1", "2", "3"],
    })
    .then((answer) => {
      connection.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, CONCAT(mgr.first_name,' ',mgr.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees mgr ON employees.manager_id = mgr.id WHERE departments.id = '${answer.department}'`,
        (err, data) => {
          if (err) throw err;
          console.table(data);
          runApp();
        }
      );
    });
};

// Display all employees with the same role
const viewRole = () => {
  // TODO: Add query to get role names
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Select role:",
      choices: ["1", "2", "3"],
    })
    .then((answer) => {
      connection.query(
        `SELECT employees.id, employees.first_name, employees.last_name, departments.title, CONCAT(mgr.first_name,' ',mgr.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees mgr ON employees.manager_id = mgr.id WHERE employees.role_id = '${answer.role}'`,
        (err, data) => {
          if (err) throw err;
          console.table(data);
          runApp();
        }
      );
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
  // TODO: Add query to get department names
  connection.query("SELECT id, title FROM departments", (err, res) => {
    if (err) throw err;
    const dept = res.map((department) => {
      return {
        name: department.title,
        value: department.id,
      };
    });
    inquirer
      .prompt([
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
          type: "list",
          message: "New role department:",
          choices: dept,
        },
      ])
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
  });
};

// Add a new employee to the database using prompts
const addEmployee = () => {
  // TODO: Query to get manager and roles names
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "First name:",
      },
      {
        name: "last",
        type: "last",
        message: "Last name:",
      },
      {
        name: "role",
        type: "input",
        message: "Role:",
      },
      {
        name: "manager",
        type: "input",
        message: "Manager:",
      },
    ])
    .then((answers) => {
      connection.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${answers.first}", "${answers.last}", ${answers.role}, ${answers.manager})`,
        (err, data) => {
          if (err) throw err;
          console.log("New employee added!");
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
