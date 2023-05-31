const db = require("../services/database").config;
const bcrypt = require("bcrypt");

// Handles the database calls for the user routes
let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", function(err, users, fields) {
        if(err) {
            reject(err);
        } else {
            console.log(users);
            resolve(users);
        }
    });
});

let getUserById = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users WHERE id = ${id}`, function(err, user, fields) {
        if(err) {
            reject(err);
        } else {
            console.log(user[0]);
            resolve(user[0]);
        }
    });
});


let updateUser = (userData, id) => new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    let sql = "UPDATE users SET " +
        "name = " + db.escape(userData.name) +
        ", surname = " + db.escape(userData.surname) +
        ", hero = " + db.escape(userData.hero) +
        ", email = " + db.escape(userData.email) +
        ", info = " + db.escape(userData.info) +
        ", password = " + db.escape(userData.password) +
        " WHERE id = " + parseInt(id);

    console.log(sql);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected!");
        userData.id = id;
        resolve(userData);
    });
});

let addUser = (userData) => new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    let sql = "INSERT INTO users (name, surname, hero, email, info, password) VALUES (" +
        db.escape(userData.name) +
        ", " + db.escape(userData.surname) +
        ", " + db.escape(userData.hero) +
        ", " + db.escape(userData.email) +
        ", " + db.escape(userData.info) +
        ", " + db.escape(userData.password) + ")";

    console.log(sql);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        }
        userData.id = result.insertId;
        resolve(userData);
    });
});


let deleteUser = (id) => new Promise((resolve, reject) => {
    let sql = `DELETE FROM users WHERE id = ${id}`;

    console.log(sql);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected!");
        resolve();
    });
});

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    addUser,
    deleteUser,
}