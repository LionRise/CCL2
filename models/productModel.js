const db = require("../services/database").config;

// Handles the database calls for the product routes
let getProducts = () => new Promise((resolve, reject) => {
    const query = "SELECT * FROM products";
    db.query(query, function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(products);
        }
    });
});

let getProductById = (id) => new Promise((resolve, reject) => {
    const query = "SELECT prod.id AS product_id, prof.id AS profile_id, prof.*, prod.* FROM products prod JOIN profiles prof ON prod.fk_profileid = prof.id WHERE prod.id = ?";
    db.query(query, [id], function (err, product, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(product[0]);
        }
    });
});

let updateProduct = (productData, id) => new Promise((resolve, reject) => {
    const query = "UPDATE products SET title = ?, price = ?, state = ?, description = ?, productPicName = ? WHERE id = ?";
    const values = [productData.title, productData.price, productData.state, productData.description, productData.productPicName, id];
    db.query(query, values, function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            getProductById(id).then((product) => {
                resolve(product);
            });
        }
    });
});

let addProduct = (productData) => new Promise((resolve, reject) => {
    const query = "INSERT INTO products (title, price, state, description, fk_profileid, productPicName) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [productData.title, productData.price, productData.state, productData.description, productData.fk_profileid, productData.productPicName];
    db.query(query, values, function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            if (result && result.insertId) {
                productData.insertId = result.insertId;
                resolve(productData);
            } else {
                reject(new Error("Failed to retrieve the insertId"));
            }
        }
    });
});

let deleteProduct = (id) => new Promise((resolve, reject) => {
    const query = "DELETE FROM products WHERE id = ?";
    db.query(query, [id], function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    addProduct,
    deleteProduct,
};
