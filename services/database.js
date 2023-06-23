require('dotenv').config(); // allows us to use the variables from the dotenv file
const mysql = require('mysql');

// Connects to the database
const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: "8007",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc221042",
});

// Checks if the connection to the database was successful
config.connect((error) => {
    if(error) throw error;
    else console.log("Connected to database!");
});

module.exports = { config };
