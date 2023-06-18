const express = require("express");
const router = express.Router();
const path = require("path");

const productController = require("../controllers/productController.js");

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

// For editing the product
// Actually "put" is for updating and "post" is for creating => just for semester project
router.get("/:id/edit", productController.editProduct);
router.post("/:id", productController.updateProduct);

router.get("/:id/delete", productController.deleteProduct);

// request a product picture as a post
router.route("/:id/picture")
    .get((req, res) => {
        let uID = req.params.id;
        const filename = uID + ".jpg";
        const options = {
            root: path.join(__dirname, "../public/uploads")
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
                let picture = req.files['productPicName'];
                let uuidfilename = uuidv4() + ".jpg";

                let filename = "./public/uploads/" + uuidfilename;
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
            console.log(err)
            res.status(500).send(err);
        }
    });

module.exports = router;
