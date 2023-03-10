const mysql = require('mysql2/promise');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { ConnectableObservable } = require('rxjs');
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
};

async function viewRoles() {
  const db = await connect();
  const sql = `SELECT * FROM roles`;
  const [rows] = await db.execute(sql);
  console.log('\n');
  console.table(rows); 
  console.log('\n');
};

async function viewEmployees() {
  const db = await connect();
  const sql = `SELECT * FROM employee`;
  const [rows] = await db.execute(sql);
  console.log('\n');
  console.table(rows); 
  console.log('\n');
  db.end();
  mainMenu();
};

function mainMenu(){
  const query = [
    {
      name: "mMenu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "NO - Add Employee",
        "NO - Update Employee Role",
        "View All Roles",
        "NO - Add Role",
        "View All Departments",
        "Add Department",
        "Quit"
      ]
    },
  ]

  return inquirer.prompt(query);
};

function quit() {
  process.exit(0);
}

async function main(){
  console.log(`\n                ----------                \n`);
  console.log(`Welcome to Jacob's Employee Managment System\n`);
  console.log(`         Copyright 2023 Jacob Jeffries      `);
  console.log(`\n                ----------                \n`);

  const { mMenu } = await mainMenu();

  if(mMenu ===  "View All Employees"){
    viewEmployees();
  }else if(mMenu === 'Quit'){
    quit();
  }
};
main();