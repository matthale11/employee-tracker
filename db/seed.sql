USE employee_db;

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Junior Programmer", 50000, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1);