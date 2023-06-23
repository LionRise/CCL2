const cartItemsModel = require("../models/cartItemsModel");

// Function to add a product to the cart
const addToCart = (req, res, next) => {
    const { profileId, productId } = req.body; // Extract the necessary data from the request body or query parameters

    cartItemsModel.addToCart(profileId, productId)// Call the addToCart function with the retrieved data
        .then(() => {
            console.log("Product added to the cart successfully");
            res.status(200).send("Product added to the cart successfully");
        })
        .catch((err) => {
            console.error("Error adding product to the cart", err);
            res.status(500).send("Error adding product to the cart Controller");
        });
};



module.exports = {
    addToCart,
}