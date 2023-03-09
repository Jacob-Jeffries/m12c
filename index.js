// const inq = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to Database: ${process.env.DB_NAME}, as ${process.env.DB_USER}.`)
);

function viewDepartments() {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    }else{
      console.table(result);
    }
  })
 
};

viewDepartments();
