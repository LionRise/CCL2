const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController.js");
const profileController = require("../controllers/profileController.js");
const authenticationService = require("../services/authentication");

// Check if the profile is logged in and if the token is valid
// This function is executed before all following routes! => Important to be on top
router.use(authenticationService.authenticateJWT); //checks if the profile is logged in, before it shows him the profile, so it has to be first

router.get("/", profileController.getProfiles);
router.post("/added", profileController.addProfile);

router.get("/:id", profileController.getProfileById);

// For editing the profile
// Actually "put" is for updating and "post" is for creating => just for semester project
router.get("/:id/edit", profileController.editProfile);
router.post("/:id", profileController.updateProfile);

router.get("/:id/delete", profileController.deleteProfile);

// request a profile picture as a post
router.route("/:id/picture")
    .get((req, res) => {
        let uID = req.params.id;
        const filename = uID + ".jpg";
        const options = {
            root: path.join(__dirname, "../uploads")
        };
        res.sendFile(filename, options);
    })
    .post((req, res) => {
        try {
            if (!req.files) {
                // handle what should happen if there is no request file
                res.send({
                    status: false,
                    message: "No file uploaded",
                });
            } else {
                // handle how to save the picture
                let picture = req.files.picture;

                let filename = "./uploads/" + req.params.id + ".jpg";
                picture.mv(filename);
                console.log("Picture saved to " + filename);

                res.send({
                    status: true,
                    message: "File is uploaded",
                    data: {
                        name: picture.name,
                        size: picture.size,
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = router;
