const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");
const authenticationService = require("../services/authentication");

// Check if the user is logged in and if the token is valid
// This function is executed before all following routes! => Important to be on top
router.use(authenticationService.authenticateJWT); //checks if the user is logged in, before it shows him the user, so it has to be first

router.get("/", userController.getUsers);
router.post("/added", userController.addUser);

router.get("/:id", userController.getUserById);

// For editing the user
// Actually "put" is for updating and "post" is for creating => just for semester project
router.get("/:id/edit", userController.editUser);
router.post("/:id", userController.updateUser);

router.get("/:id/delete", userController.deleteUser);

// request a user picture as a post
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
                // handle how to safe the picture
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
