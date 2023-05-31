const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");
const userModel = require("../models/userModel");
const authenticationService = require("../services/authentication");

let storage = {};

router.get("/", (req, res) => {
    // send the rendered page
    res.render("index");
});

router.route("/login")
    .get((req, res, next) => res.render("login"))
    .post((req, res, next) => {
        userModel.getUsers()
            .then((users) => {
                authenticationService.authenticateUser(req.body, users, res, next);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });

router.get("/logout", (req, res, next) => {
    res.cookie("accessToken", "", {maxAge: 0});
    res.redirect("/");
});

router.get("/register", (req, res) => {
    // send the rendered page
    res.render("register");
});

router.post("/", userController.register);

router.get("/addUser", (req, res) => {
    res.render("addUser");
});

router.post("/", (req, res, next) => {
    storage = req.body;
    console.log(storage);
    res.send("Received your post request");
});

router.get("/example/b", (req, res, next) => {
    console.log("The response will be sent by the next function...");
    next();
}, (req, res) => {
    res.send("This is the response!");
});

router.get("/chat", (req, res, next) => {
    res.render("chat");
})


const cbC1 = (req, res, next) => {
    console.log("cbC1");
    next();
};

const cbC2 = (req, res, next) => {
    console.log("cbC2");
    next();
};

const cbC3 = (req, res) => {
    res.send("Hello from cbC3!");
};

router.get("/example/c", [cbC1, cbC2, cbC3]);

const cbD1 = (req, res, next) => {
    console.log("cbD1");
    next();
};

const cbD2 = (req, res, next) => {
    console.log("cbD2");
    next();
};

router.get("/example/d", [cbD1, cbD2], (req, res, next) => {
    console.log("The response will be sent by the next function...");
    next();
}, function cbD3(req, res) {
    res.send("Hello from D! (function cbD3)");
});

router.get("/cookies", (req, res, next) => {
    // Read cookies
    let counter = req.cookies["visitCounter"];
    if(isNaN(counter)) counter = 0;
    counter++;
    console.log("Current counter value: " + counter);

    // Set cookies
    res.cookie("visitCounter", counter, {maxAge: 2*60*60*1000});
    res.send("You have visited the website " + counter + " times");
});

module.exports = router;
