const profileModel = require("../models/profileModel.js");
const productModel = require("../models/productModel");
const authenticationService = require("../services/authentication");

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
//Also passes the products to the profile page
async function getProfileById(req, res, next) {
    try {
        const [profile, products] = await Promise.all([ //Promise.all() allows us to run multiple promises at the same time
            profileModel.getProfileById(+req.params.id), //+req.params.id converts the id from a string to a number
            productModel.getProducts()                  //gets all the products
        ]);

        profile.id = req.params.id;
        res.render("profile", {profile, products});
    } catch (err) {
        res.status(404);
        next(err);
    }
}

//Gets a profile by id from the cookie and renders the profile page (single profile)
async function getProfileByCookieId(req, res) {
    try {
        const [profile, products] = await Promise.all([
            profileModel.getProfileById(+req.cookies.profileid),
            productModel.getProducts()
        ]);

        profile.id = req.cookies.profileid;
        return profile;
    } catch (err) {
        return null;
    }
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
    profileModel.updateProfile(req.body)
        .then((profile) => {
            res.redirect("/profiles/" + req.body.profileId);
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
            authenticationService.loggedin = true;
            res.cookie("profileid", profile.id);
            res.cookie("loggedin", authenticationService.loggedin);
            res.redirect("/profiles/" + profile.id);
            //res.redirect("/");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

async function register(req, res, next) {
    try {
        if (!req.files || !req.files.profilePicName) {
            res.status(400).send({
                status: false,
                message: "No profile picture uploaded",
            });
            return;
        }

        const picture = req.files.profilePicName;
        const uuidfilename = broofa() + ".jpg";
        const filename = "./public/uploads/" + uuidfilename;

        picture.mv(filename, async function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }

            const profileData = {
                ...req.body,
                profilePicName: uuidfilename
            };

            try {
                const profile = await profileModel.addProfile(profileData);
                res.cookie("profileid", profile.id);
                res.cookie("loggedin", true);
                console.log('redirecting: /profiles/' + profile.id);
                authenticationService.loggedin = true;
                res.redirect("/profiles/" + profile.id);
            } catch (err) {
                res.status(500).send(err.message);
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

//Generates a random uuid
function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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
    getProfileByCookieId
}