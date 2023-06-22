const db = require("../services/database").config;

// Handles the database calls for the cartItem routes
let getCartItems = () => new Promise((resolve, reject) => {
    const query = "SELECT * FROM cartItems";
    db.query(query, function (err, cartItems, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(cartItems);
        }
    });
});

let getCartItemById = (id) => new Promise((resolve, reject) => {
    const query = "SELECT * FROM cartItems WHERE id = ?";
    db.query(query, [id], function (err, cartItem, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(cartItem[0]);
        }
    });
});

let JoinedCartItems = () => new Promise((resolve, reject) => {
    const query = "SELECT prod.id AS product_id, prof.id AS profile_id, prof.*, prod.*, ci.* " +
        "FROM products prod " +
        "JOIN profiles prof ON prod.fk_profileid = prof.id" +
        "JOIN cartItems ci ON ci.fk_profile_id = prof.id AND ci.fk_product_id = prod.id" +
        "WHERE prod.id = ?";

    db.query(query, function (err, cartItems, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(cartItems);
        }
    });
});

// Assuming you have access to the database connection object as `db`

// Function to add a product to the cart
const addToCart = (profileId, productId, quantity) => {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO cartItems (fk_profile_id, fk_product_id) VALUES (?, ?)";
        const values = [profileId, productId];

        db.query(query, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = {
    getCartItems,
    getCartItemById,
    JoinedCartItems,
    addToCart,
}