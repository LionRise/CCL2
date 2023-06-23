const express = require("express");
const router = express.Router();
const path = require("path");

const productController = require("../controllers/productController.js");
const productModel = require("../models/productModel");

//Gets all the products from the database and renders the products page
router.get("/", productController.getProducts);

//Gets the product by id from the database and renders the product page
router.get("/:id", productController.getProductById);

// For editing the product
router.get("/:id/edit", productController.editProduct)

// For updating the product
router.post("/:id", productController.updateProduct)

// For deleting the product
router.get("/:id/delete", productController.deleteProduct);

module.exports = router;
