const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController.js");
const profileModel = require("../models/profileModel");
const productController = require("../controllers/productController.js");
const productModel = require("../models/productModel");
const authenticationService = require("../services/authentication");
const path = require("path");

let storage = {};

router.get("/", (req, res) => {
    // Retrieve the products from the database using productModel
    productModel.getProducts()
        .then((products) => {
            // Pass the products to the rendered page
            res.render("index", {products});
        })
        .catch((err) => {
            // Handle any errors that occurred during the database query
            res.status(500).send(err.message);
        });
});


router.route("/myProfile")
    .get((req, res, next) => {
        authenticationService.goToProfile(req.profile, res, next);
    });

router.get('/products', async (req, res, next) => {
    try {
        // Fetch the products from the database
        const products = await productModel.getProducts(); // Assuming getProducts() returns a promise
        const profiles = await profileModel.getProfiles(); // Assuming getProducts() returns a promise

        // Pass the profile variable to the template
        const profile = req.profile;

        // Render the template and pass the products
        res.render('products', {products: products, profiles: profiles, profile: profile});
    } catch (error) {
        // Handle the error appropriately
        console.error('Error fetching products:', error);
        console.log('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.route("/login")
    .get((req, res, next) => res.render("login"))
    .post((req, res, next) => {
        profileModel.getProfiles()
            .then((profiles) => {
                authenticationService.authenticateProfile(req.body, profiles, res, next);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });

router.get("/logout", (req, res, next) => {
    res.cookie("accessToken", authenticationService.loggedin, "", {maxAge: 0});
    authenticationService.loggedin = false;
    res.redirect("/");
});

router.get("/register", (req, res) => {
    // send the rendered page
    res.render("register");
});

router.post("/", profileController.register);
router.post("/", productController.register);

router.get("/addProfile", (req, res) => {
    res.render("addProfile");
});


router.route("/addProduct")
    .get((req, res) => {
        let uID = req.params.id;
        const filename = uID + ".jpg";
        const options = {
            root: path.join(__dirname, ".../public/uploads/")
        };
        res.sendFile(filename, options);
        const profileid = req.cookies.profileid; // Retrieve the profile ID from the cookie
        res.render("addProduct", {profileid});
    })
    .post((req, res) => {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: "No file uploaded",
                });
            } else {
                const picture = req.files.productPicName;
                const uuidfilename = broofa() + ".jpg";
                const filename = "./public/uploads/" + uuidfilename;

                picture.mv(filename, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        const productData = {...req.body, productPicName: uuidfilename};
                        productModel
                            .addProduct(productData)
                            .then((product) => {
                                res.redirect("/products/" + product.insertId);
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

router.post("/", (req, res, next) => {
    storage = req.body;
    console.log(storage);
    res.send("Received your post request");
});

router.get("/chat", (req, res, next) => {
    res.render("chat");
})

router.get("/cookies", (req, res, next) => {
    // Read cookies
    let counter = req.cookies["visitCounter"];
    if (isNaN(counter)) counter = 0;
    counter++;
    console.log("Current counter value: " + counter);

    // Set cookies
    res.cookie("visitCounter", counter, {maxAge: 2 * 60 * 60 * 1000});
    res.send("You have visited the website " + counter + " times");
});

module.exports = router;