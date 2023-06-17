const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController.js");

router.get("/", productController.getProducts);
router.post("/added", productController.addProduct);

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
                let picture = req.files['undefined'];
                let uuidfilename = uuidv4() + ".jpg";

                let filename = "./uploads/" + uuidfilename;
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

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

module.exports = router;
