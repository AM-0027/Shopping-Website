const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin@1234", // ← ADD THIS
  database: "shop_auth"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:😑", err.message);
  } else { 
    console.log("MySQL connected successfully😃");
  }
});

module.exports = db;
