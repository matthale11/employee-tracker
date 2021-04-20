USE employee_db;

INSERT INTO departments (title)
VALUES ("Engineering"), ("Marketing"), ("Human Resources"), ("Administration");

INSERT INTO roles (title, salary, department_id)
VALUES ("Junior Programmer", 50000, 1), ("Senior Programmer", 70000, 1), ("Software Manager", 100000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 2), ("Jane", "Doe", 3, null), ("Adam", "Smith", 2, 2), ("Helen", "Keller", 2, 2);