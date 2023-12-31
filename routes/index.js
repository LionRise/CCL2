const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const profileModel = require("../models/profileModel");
const cartItemsModel = require("../models/cartItemsModel");
const productModel = require("../models/productModel");
const authenticationService = require("../services/authentication");
const path = require("path");

let storage = {};

// Get for the home page. Gets all the products from the database and renders the home page
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

// Post for the home page. Initial rendering
router.post("/", (req, res, next) => {
    storage = req.body;
    res.send("Received your post request");
});

// Routes to the profile or renders the login page
router.route("/myProfile")
    .get((req, res, next) => {
        authenticationService.goToProfile(req.profile, res, next);
    });

// Routes to the login page and authenticates the profile
router.route("/login")
    .get((req, res, next) => {
        res.render("login");
    })
    .post((req, res, next) => {
        profileModel.getProfiles()
            .then(async (profiles) => {
                await authenticationService.authenticateProfile(req.body, profiles, res, next);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });

// Logs out the profile
router.get("/logout", (req, res, next) => {
    authenticationService.loggedin = false;
    //Overwrites the cookies to log out the profile
    res.cookie("profileid", 0)
    res.cookie("loggedin", authenticationService.loggedin)
    res.cookie("accessToken", "", {maxAge: 0});
    res.redirect("/"); // Redirects to the home page
});

// Routes to the register page
router.get("/register", (req, res) => {
    //For the profile picture
    let uID = req.params.id;
    const filename = uID + ".jpg";
    const options = {
        root: path.join(__dirname, ".../public/uploads/")
    };
    res.sendFile(filename, options);
    res.render("register");
});

// Registers the profile and redirects to the home page
router.post("/", profileController.register);


// Routes to the cart
router.get("/cart", (req, res, next) => {
    cartItemsModel.joinedCartItems(req.cookies.profileid)
        .then((cartItems) => {
            res.render("cart", {cartItems});
        });
})

// Route for adding a product to the cart
router.post("/addToCart", (req, res) => {
    // Extract the necessary data from the request body or query parameters
    const profileId = req.cookies.profileid;
    const productId = req.body.productId;

    // Call the addToCart function with the retrieved data
    cartItemsModel.addToCart(profileId, productId)
        .then((result) => {
            console.log("Product added to the cart successfully");
            // Handle success response, such as sending a response to the client
            res.status(204).send("Product added to the cart successfully");
        })
        .catch((err) => {
            console.error("Error adding product to the cart", err);
            // Handle error response, such as sending an error message to the client
            res.status(500).send("You can't add products to the cart if you're not logged in.");
        });
});


// Routes to the products page
router.get('/products', async (req, res, next) => {
    try {
        // Fetch the products and profiles from the database
        const products = await productModel.getProducts();
        const profiles = await profileModel.getProfiles();

        // Initialize the profile variable
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

// Route for adding a product
router.route("/addProduct")
    //For the product picture
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
                                res.redirect("/products/" + product.insertId); // In the end. Redirect to the product page
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

// Generates a random UUID
function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Routes to the cart
router.get("/chat", (req, res, next) => {
    res.render("chat");
})

// Routes to the cookie page (For fun) Tracks the amount of times you visited that page
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