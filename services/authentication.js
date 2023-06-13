const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

//This function is used to check if the password is correct
async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

let loggedin = false;

//This function is used to authenticate the user
async function authenticateUser({email, password}, users, res, next) {
    const user = users.find(u => {
        return u.email === email;
    });

    //If the user exists and the password is correct, we create a token and redirect the user to the user page
    if(user && await checkPassword(password, user.password)) {
        const accessToken = jwt.sign({ id: user.id, name: user.name }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        loggedin = true;
        res.cookie("accessToken", accessToken, loggedin);
        res.redirect("/users/" + user.id);
    } else {
        next("Email or password incorrect!");
    }
}

function goToProfile(user, res, loggedin, next) {
    if (!loggedin) {
        res.render("login");
        console.log("User is not logged in");
    } else {
        res.redirect("/users/" + user.id);
        console.log("User is logged in");
    }
}

//This function is used to authenticate the JWT
function authenticateJWT(req, res, next) {
    const token = req.cookies["accessToken"];

    //If the token exists, we verify it
    if(token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                next("Not logged in");
            }
            console.log(user);
            req.user = user;
            next();
        });
    } else {
        next("Unauthorized");
    }
}

module.exports = {
    authenticateUser,
    authenticateJWT,
    goToProfile,
    loggedin,
}