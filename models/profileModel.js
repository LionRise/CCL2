const db = require("../services/database").config;
const bcrypt = require("bcrypt");

// Handles the database calls for the profile routes
let getProfiles = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM profiles", function(err, profiles, fields) {
        if(err) {
            reject(err);
        } else {
            console.log(db, "getProfiles");
            resolve(profiles);
        }
    });
});

let getProfileById = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT profiles.*, products.*
              FROM profiles
              JOIN products ON profiles.id = products.fk_profileid
              WHERE profiles.id = ${id};`,
        function(err, products, fields) {
            if(err) {
                reject(err);
            } else {
                console.log(products[0], "products[0]");
                resolve(products[0]);
            }
        });
});


let updateProfile = (profileData, id) => new Promise(async (resolve, reject) => {
    profileData.password = await bcrypt.hash(profileData.password, 10);
    let sql = "UPDATE profiles SET " +
        "name = " + db.escape(profileData.name) +
        ", email = " + db.escape(profileData.email) +
        ", info = " + db.escape(profileData.info) +
        " WHERE id = " + parseInt(id);

    console.log(sql);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected!");
        profileData.id = id;
        resolve(profileData);
    });
});

let addProfile = (profileData) => new Promise(async (resolve, reject) => {
    profileData.password = await bcrypt.hash(profileData.password, 10);
    let sql = "INSERT INTO profiles (name, email, info, password) VALUES (" +
        db.escape(profileData.name) +
        ", " + db.escape(profileData.email) +
        ", " + db.escape(profileData.info) +
        ", " + db.escape(profileData.password) + ")";

    console.log(sql);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        }
        profileData.id = result.insertId;
        resolve(profileData);
    });
});


let deleteProfile = (id) => new Promise((resolve, reject) => {
    let sql = `DELETE FROM profiles WHERE id = ${id}`;

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
    getProfiles,
    getProfileById,
    updateProfile,
    addProfile,
    deleteProfile,
}