const productModel = require("../models/productModel.js");

//Gets the products from the database and renders the products (all products)
function getProducts(req, res, next) {
    productModel.getProducts()
        .then((products) => {
            res.render("products", {products});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Gets a product by id from the database and renders the product page (single product)
function getProductById(req, res, next) {
    productModel.getProductById(parseInt(req.params.id))
        .then((product) => {
            res.render("product", {product});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

//Gets a product by id from the database and renders the editProduct page
function editProduct(req, res, next) {
    productModel.getProductById(parseInt(req.params.id))
        .then((product) => {
            res.render("editProduct", {product});
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
            res.render("product", {product});
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
            res.render("product", {product});
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