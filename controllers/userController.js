const userModel = require("../models/userModel.js");

//Gets the users from the database and renders the users (all users)
function getUsers(req, res, next) {
    userModel.getUsers()
        .then((users) => {
            res.render("users", { users });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Gets a user by id from the database and renders the user page (single user)
function getUserById(req, res, next) {
    userModel.getUserById(parseInt(req.params.id))
        .then((user) => {
            res.render("user", { user });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Gets a user by id from the database and renders the editUser page
function editUser(req, res, next) {
    userModel.getUserById(parseInt(req.params.id))
        .then((user) => {
            res.render("editUser", { user });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Updates a user by id from the database and renders the user page (single user)
function updateUser(req, res, next) {
    userModel.updateUser(req.body, req.params.id)
        .then((user) => {
            res.render("user", { user });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Adds a user to the database and renders the user page (single user)
function addUser(req, res, next) {
    userModel.addUser(req.body)
        .then((user) => {
            res.render("user", { user });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Registers a new user and adds it to the database and renders the welcome page
function register(req, res, next) {
    userModel.addUser(req.body)
        .then(() => {
            res.render("index");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Deletes a user by id from the database and renders the deletedUser page
function deleteUser(req, res, next) {
    userModel.deleteUser(req.params.id)
        .then(() => {
            res.render("deletedUser");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });

}

//Exports the functions
module.exports = {
    getUsers,
    getUserById,
    editUser,
    addUser,
    updateUser,
    deleteUser,
    register,
}