const mysql = require('mysql2/promise');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { ConnectableObservable } = require('rxjs');
const { clear } = require('console');
require('dotenv').config();

async function connect() {  
const db = await mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    // console.log(`Connected to Database: ${process.env.DB_NAME}, as ${process.env.DB_USER}.`)
  );
  return db;
};

async function viewDepartments() {
  const db = await connect();
  const sql = `SELECT * FROM department`;
  const [rows] = await db.execute(sql);
  console.log('\n');
  console.table(rows); 
  console.log('\n');  
  main();
};

async function viewRoles() {
  const db = await connect();
  const sql = `SELECT * FROM roles`;
  const [rows] = await db.execute(sql);
  console.log('\n');
  console.table(rows); 
  console.log('\n');
  main();
};

async function viewEmployees() {
  const db = await connect();
  const sql = `SELECT * FROM employee`;
  const [rows] = await db.execute(sql);
  console.log('\n');
  console.table(rows); 
  console.log('\n');
  main();
};

async function getNames(){
  const db = await connect();
  const sql = `SELECT CONCAT(id,' ',first_name,' ',last_name) AS name FROM employee`;
  const [rows] = await db.execute(sql);
  let names = ['No Manager'];
  Object.values(rows).forEach((row) => {names.push(row.name)});
  return names;
};

async function getRoles(){
  const db = await connect();
  const sql = `SELECT title FROM roles`;
  const [rows] = await db.execute(sql);
  let roles = [];
  Object.values(rows).forEach((row) => {roles.push(row.title)});
  return roles;
};

async function getDepartments(){
  const db = await connect();
  const sql = `SELECT CONCAT(id,' ',dept_name) AS dept FROM department`;
  const [rows] = await db.execute(sql);
  let depts = [];
  Object.values(rows).forEach((row) => {depts.push(row.dept)});
  return depts;
};

async function addDepartment(){
 const db = await connect();
 display();
 const query = [
    {
      name: 'dept',
      type: 'text',
      message: 'Please enter the name of the new Department'
    }
  ];
  const department = await inquirer.prompt(query);
  const {dept} = department;
  const sql = `INSERT INTO department (dept_name) VALUES (?)`;
  const [rows] = await db.execute(sql, [dept])
  viewDepartments();
};

async function addRole(){
  const db = await connect();
  const depts = await getDepartments();
  display();
  const query = [
    {
      name: 'title',
      type: 'text',
      message: 'Please enter the Title of the new Role: '
    },
    {
      name: 'salary',
      type: 'number',
      message: 'Please enter the Salary for this new Role (whole dollars): $',
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Please select the associated Department for this new Role:',
      choices: depts,
      loop: false
    }
  ];
  const department = await inquirer.prompt(query);
  const {title, salary, department_id} = department;
  const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
  // LOL parseINT() is so much easier than what I did earlier to get the id!
  // I am going to leave both examples of ways to do it since I did both.
  const id = parseInt(department_id);
  const [rows] = await db.execute(sql, [title, salary, id])
  viewRoles();
};

async function addEmployee() {
  const db = await connect();
  const names = await getNames();
  const roles = await getRoles();
  display();
  console.log('\n');
  const query = [
    { 
      name: 'fn',
      type: 'text',
      message: 'Please enter the new employee\'s Frist Name: '
    },
    {
      name: 'ln',
      type: 'text',
      message: 'Please enter the new employee\'s Last Name: '
    },
    {
      name: 'rid',
      type: 'list',
      message: 'Please select the new employee\'s Title: ',
      choices: roles,
      loop: false
    },
    {
      name: 'man',
      type: 'list',
      message: 'Please select the new employee\'s Manager: ',
      choices: names,
      loop: false
    }
  ];
  const nEmp = await inquirer.prompt(query);
  const role_id = roles.indexOf(nEmp.rid) + 1;
  const { fn, ln, man } = nEmp;
  let manager = names.indexOf(nEmp.man);
  if(man === 'No Manager'){manager = null};
  const sql = 'INSERT INTO employee (first_name, last_name, roles_id, manager) VALUES(?,?,?,?)';
  const [rows] = await db.execute(sql, [fn, ln, role_id, manager]);
  viewEmployees();
};

function mainMenu(){
  console.log('\n');
  const query = [
    {
      name: "mMenu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "NO - Update Employee Role",
        "View All Roles",
        "Add New Role",
        "View All Departments",
        "Add New Department",
        "Clear Screen",
        "Quit"
      ],
      loop: false
    }
  ];
  return inquirer.prompt(query);
};

function display(){
  clear();
  console.log(`\n                ----------                \n`);
  console.log(`Welcome to Jacob's Employee Managment System\n`);
  console.log(`         Copyright 2023 Jacob Jeffries      `);
  console.log(`\n                ----------                \n`);
}

async function main(){
  const { mMenu } = await mainMenu();
  if(mMenu ===  "View All Employees"){
    viewEmployees();
  }else if(mMenu === 'Add Employee'){
    addEmployee();
  }else if(mMenu === 'View All Roles'){
    viewRoles();
  }else if(mMenu === 'Add New Role'){
    addRole();
  }else if(mMenu === 'View All Departments'){
    viewDepartments();
  }else if(mMenu === 'Add New Department'){
    addDepartment();
  }else if(mMenu === 'Clear Screen'){
    display();
    main();
  }else if(mMenu === 'Quit'){
    quit();
  }
};

async function quit() {
  const db = await connect();
  db.end();
  clear();
  process.exit(0);
}

display();
main();