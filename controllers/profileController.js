const profileModel = require("../models/profileModel.js");
const productModel = require("../models/productModel");

//Gets the profiles from the database and renders the profiles (all profiles)
function getProfiles(req, res, next) {
    profileModel.getProfiles()
        .then((profiles) => {
            res.render("profiles", {profiles});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Gets a profile by id from the database and renders the profile page (single profile)
/*function getProfileById(req, res, next) {
    profileModel.getProfileById(parseInt(req.params.id))
        .then((profile) => {
            res.render("profile", { profile });
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}*/

function getProfileById(req, res, next) {
    Promise.all([
        profileModel.getProfileById(parseInt(req.params.id)),
        productModel.getProducts()
    ])
        .then(([profile, products]) => {
            profile.id = req.params.id;
            res.render("profile", {profile, products});
        })
        .catch((err) => {
            res.status(404);
            next(err);
        });
}


//Gets a profile by id from the database and renders the editProfile page
function editProfile(req, res, next) {
    profileModel.getProfileById(parseInt(req.params.id))
        .then((profile) => {
            res.render("editProfile", {profile});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Updates a profile by id from the database and renders the profile page (single profile)
function updateProfile(req, res, next) {
    profileModel.updateProfile(req.body, req.params.id)
        .then((profile) => {
            res.render("profile", {profile});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Adds a profile to the database and renders the profile page (single profile)
function addProfile(req, res, next) {
    profileModel.addProfile(req.body)
        .then((profile) => {
            res.render("profile", {profile});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Registers a new profile and adds it to the database and renders the welcome page
function register(req, res, next) {
    profileModel.addProfile(req.body)
        .then(() => {
            res.render("index");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Deletes a profile by id from the database and renders the deletedProfile page
function deleteProfile(req, res, next) {
    profileModel.deleteProfile(req.params.id)
        .then(() => {
            res.render("deletedProfile");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });

}

//Exports the functions
module.exports = {
    getProfiles,
    getProfileById,
    editProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    register,
}