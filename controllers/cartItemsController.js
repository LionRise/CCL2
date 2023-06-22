const cartItemsModel = require("../models/cartItemsModel");

//Gets the cartItems from the database and renders the cartItems (all cartItems)
function getCartItems(req, res, next) {
    cartItemsModel.getCartItems()
        .then((cartItems) => {
            res.render("cart", {cartItems});
        })
        .catch((err) => {
            res.status(404);
            next(err)
        });
}

// Function to add a product to the cart
const addToCart = (req, res, next) => {
    const { profileId, productId } = req.body;

    cartItemsModel.addToCart(profileId, productId)
        .then(() => {
            console.log("Product added to the cart successfully");
            res.status(200).send("Product added to the cart successfully");
        })
        .catch((err) => {
            console.error("Error adding product to the cart", err);
            res.status(500).send("Error adding product to the cart");
        });
};


module.exports = {
    getCartItems,
    addToCart,
}