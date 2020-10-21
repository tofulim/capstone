const mysql = require('mysql');

var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '123123',
  database : 'capstone'
});

db.connect();
module.exports = db;
