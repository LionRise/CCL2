const productModel = require("../models/productModel");
const profileModel = require('../models/profileModel');

//Gets the products from the database and renders the products (all products)
function getProducts(req, res, next) {
    productModel.getProducts() // calls the getProducts function in the productModel
        .then((products) => {
            res.render("products", {products}); //renders the products page and passes the products variable
        })
        .catch((err) => {
            res.status(404); // if there is an error, it will render the 404 page
            next(err) // passes the error to the next function
        });
}

//Gets a product by id from the database and renders the product page (single product)
async function getProductById(req, res, next) {
    try {
        const productId = req.params.id; // Get the product ID from the request parameters

        // Fetch the product by ID from the database
        const product = await productModel.getProductById(productId);

        // Fetch the profile data
        const profileId = req.cookies.profileid; // Get the profile ID from the cookie
        const profile = await profileModel.getProfileById(profileId); // Fetch the profile data from the database

        // Render the product.ejs template and pass the product and profile data
        res.render('product', {product: product, profile: profile});
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
}


//Gets a product by id from the database and renders the editProduct page
function editProduct(req, res, next) {
    productModel.getProductById(parseInt(req.params.id))
        .then((product) => {
            let profileId = req.params.id;
            res.render("editProduct", {product, profileId});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Updates a product by id from the database and renders the product page (single product)
function updateProduct(req, res, next) {
    productModel.updateProduct(req.body, req.params.id)
        .then((product) => {
            res.render("product", {product, profile: req.profile});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Adds a product to the database and renders the product page (single product)
function addProduct(req, res, next) {
    productModel.addProduct(req.body)
        .then((product) => {
            res.redirect("/products/" + product.insertId);
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Registers a new product and adds it to the database and renders the welcome page
function register(req, res, next) {
    productModel.addProduct(req.body)
        .then(() => {
            res.render("index");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Deletes a product by id from the database and renders the deletedProduct page
function deleteProduct(req, res, next) {
    productModel.deleteProduct(req.params.id)
        .then(() => {
            res.render("deletedProduct");
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Exports the functions
module.exports = {
    getProducts,
    getProductById,
    editProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    register,
}