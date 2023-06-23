const db = require("../services/database").config;
const bcrypt = require("bcrypt");

// Handles the database calls for the profile routes
let getProfiles = () => new Promise((resolve, reject) => {
    const query = "SELECT * FROM profiles WHERE profiles.profilePicName IS NOT NULL";
    db.query(query, function (err, profiles, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(profiles);
        }
    });
});

// Handles the database calls for the profile routes. Gets all profiles for a specific profile by profileId
let getProfileById = (id) => new Promise((resolve, reject) => {
    const query = `SELECT profiles.*, products.*
                   FROM profiles
                   LEFT JOIN products ON profiles.id = products.fk_profileid
                   WHERE profiles.id = ? AND profiles.profilePicName IS NOT NULL`;
    db.query(query, [id], function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(products[0]);
        }
    });
});

// Update a profile
let updateProfile = (profileData) => new Promise((resolve, reject) => {
    const query = "UPDATE profiles SET name = ?, email = ?, info = ? WHERE id = ?";
    const values = [profileData.name, profileData.email, profileData.info, profileData.profileId];
    db.query(query, values, function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(profileData);
        }
    });
});

// Adds a new profile
let addProfile = (profileData) => new Promise(async (resolve, reject) => {
    try {
        const hashedPassword = await bcrypt.hash(profileData.password, 10);
        const query = "INSERT INTO profiles (name, email, info, password, profilePicName) VALUES (?, ?, ?, ?, ?)";
        const values = [profileData.name, profileData.email, profileData.info, hashedPassword, profileData.profilePicName];
        db.query(query, values, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                profileData.id = result.insertId;
                resolve(profileData);
            }
        });
    } catch (err) {
        reject(err);
    }
});

// Deletes a profile
let deleteProfile = (id) => new Promise((resolve, reject) => {
    const query = "DELETE FROM profiles WHERE id = ?";
    db.query(query, [id], function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

module.exports = {
    getProfiles,
    getProfileById,
    updateProfile,
    addProfile,
    deleteProfile,
};
