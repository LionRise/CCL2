const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const productModel = require("../models/productModel");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

//This function is used to check if the password is correct
async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

let loggedin = false;
let id = 0;

//This function is used to authenticate the profile
async function authenticateProfile({email, password}, profiles, res, next) {
    const profile = profiles.find(u => {
        return u.email === email;
    });
    //If the profile exists and the password is correct, we create a token and redirect the profile to the profile page
    if(profile && await checkPassword(password, profile.password)) {
        id = profile.id;
        const accessToken = jwt.sign({ id: profile.id, name: profile.name }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        loggedin = true;
        res.cookie("accessToken", accessToken, {maxAge: 7200000});
        res.cookie("profileid", profile.id, {maxAge: 7200000})
        res.cookie("profilename", profile.name, {maxAge: 7200000})
        res.cookie("loggedin", loggedin, {maxAge: 7200000})
        res.redirect("/profiles/" + profile.id);
    } else {
        next("Email or password incorrect!");
    }
}

function goToProfile(profile, res, loggedin) {
    if (loggedin && !profile) {
        res.status(401).redirect("../login");
    } else {
        if (profile === null) {
            res.redirect("/login");
        } else res.redirect("/profiles/" + profile.id);
    }
}

function getProfileUrl(loggedin, id) {
    return !loggedin ? "/login" : "/profiles/" + id;
}

//This function is used to authenticate the JWT
function authenticateJWT(req, res, next) {
    const token = req.cookies["accessToken"];

    //If the token exists, we verify it
    if(token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, profile) => {
            if(err) {
                next("Not logged in");
            }
            req.profile = profile;
            next();
        });
    } else {
        next("Unauthorized");
    }
}

module.exports = {
    authenticateProfile,
    authenticateJWT,
    goToProfile,
    loggedin,
    getProfileUrl,
    id,
}