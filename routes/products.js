const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController.js");
const authenticationService = require("../services/authentication");

router.get("/", productsController.getProducts);
router.post("/added", productsController.addProduct);

router.get("/:id", productsController.getProductById);

// For editing the products
// Actually "put" is for updating and "post" is for creating => just for semester project
router.get("/:id/edit", productsController.editProduct);
router.post("/:id", productsController.updateProduct);

router.get("/:id/delete", productsController.deleteProduct);

// request a products picture as a post
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
