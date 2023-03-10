// const inq = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
require('dotenv').config();

async function connect() {  
const db = await mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to Database: ${process.env.DB_NAME}, as ${process.env.DB_USER}.`)
  );
  return db;
};


async function viewDepartments() {

  const db = await connect();

  const sql = `SELECT * FROM department`;

  const [rows] = await db.execute(sql);

  console.table(rows); 
};

async function viewRoles() {

  const db = await connect();

  const sql = `SELECT * FROM roles`;

  const [rows] = await db.execute(sql);

  console.table(rows); 
};

viewDepartments();
viewRoles();