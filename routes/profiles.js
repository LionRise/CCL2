const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController.js");
const authenticationService = require("../services/authentication");
const path = require("path");
const profileModel = require("../models/profileModel");
const {loggedin} = require("../services/authentication");

//Gets all the profiles from the database and renders the profiles page
router.get("/", profileController.getProfiles);

//Gets the profile by id from the database and renders the logged in profile page
router.get ("/profile", async (req, res,next) => {
    let loggedin = req.cookies.loggedin; // saves loggedin in the cookie
    let profile = await profileController.getProfileByCookieId(req,res); // gets the profile by cookie id
    authenticationService.goToProfile(profile, res, loggedin); // goes to profile
});


//Gets the profile by id from the database and renders the profile page (for looking at the profile from the product)
router.get("/:id", profileController.getProfileById);

// For adding the profile
router.post("/added", (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No file uploaded",
            });
        } else {
            const picture = req.files.profilePicName;
            const uuidfilename = broofa() + ".jpg";
            const filename = "./public/uploads/" + uuidfilename;

            picture.mv(filename, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    const profileData = {...req.body, profilePicName: uuidfilename};
                    profileModel
                        .addProfile(profileData)
                        .then((profile) => {
                            res.redirect("/profiles/" + profile.insertId);
                        })
                        .catch((err) => {
                            res.status(500).send(err.message);
                        });
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// For the profile picture
function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// For editing the profile
router.get("/:id/edit", authenticationService.authenticateJWT, profileController.editProfile);

// For updating the profile
router.post("/", authenticationService.authenticateJWT, profileController.updateProfile);

// For deleting the profile
router.get("/:id/delete", authenticationService.authenticateJWT, profileController.deleteProfile);

module.exports = router;
