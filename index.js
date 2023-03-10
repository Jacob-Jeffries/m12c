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
  const sql = `SELECT CONCAT(first_name,' ',last_name) AS name FROM employee`;
  const [rows] = await db.execute(sql);
  let names = ['No Manager'];
  Object.values(rows).forEach((name) => {names.push(name.name)});
  return names;
};

async function getRoles(){
  const db = await connect();
  const sql = `SELECT title FROM roles`;
  const [rows] = await db.execute(sql);
  let roles = [];
  Object.values(rows).forEach((role) => {roles.push(role.title)});
  return roles;
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
      choices: roles
    },
    {
      name: 'man',
      type: 'list',
      message: 'Please select the new employee\'s Manager: ',
      choices: names
    }
  ]

  const nEmp = await inquirer.prompt(query);
  const role_id = roles.indexOf(nEmp.rid) + 1;

  const { fn, ln, man } = nEmp;
  let manager = names.indexOf(nEmp.man);
  
  if(man === 'No Manager'){
    manager = null;
  }

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
        "NO - Add Role",
        "View All Departments",
        "Add Department",
        "Clear Screen",
        "Quit"
      ]
    },
  ]

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
  }else if(mMenu === 'View All Departments'){
    viewDepartments();
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