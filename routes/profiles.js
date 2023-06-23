const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController.js");
const authenticationService = require("../services/authentication");
const path = require("path");
const profileModel = require("../models/profileModel");
const {loggedin} = require("../services/authentication");


router.get("/", profileController.getProfiles);

router.get ("/profile", async (req, res,next) => {
    let loggedin = req.cookies.loggedin;
    let profile = await profileController.getProfileByCookieId(req,res);
    authenticationService.goToProfile(profile, res, loggedin);
});

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

function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


router.get("/:id", profileController.getProfileById);


// For editing the profile
// Actually "put" is for updating and "post" is for creating => just for semester project
router.get("/:id/edit", authenticationService.authenticateJWT, profileController.editProfile);
router.post("/", authenticationService.authenticateJWT, profileController.updateProfile);
router.get("/:id/delete", authenticationService.authenticateJWT, profileController.deleteProfile);

module.exports = router;
