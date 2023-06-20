const db = require("../services/database").config;

// Handles the database calls for the product routes
let getProducts = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM products", function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(products);
        }
    });
});

let getProductById = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT products.*, profiles.* FROM products JOIN profiles ON products.fk_profileid = profiles.id WHERE products.id = ${id}`, function (err, product, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(product[0]);
        }
    });
});


let updateProduct = (productData, id) => new Promise(async (resolve, reject) => {
    let sql = "UPDATE products SET " +
        "title = " + db.escape(productData.title) +
        ", price = " + db.escape(productData.price) +
        ", state = " + db.escape(productData.state) +
        ", description = " + db.escape(productData.description) +
        " WHERE id = " + parseInt(id);

    console.log(sql);

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected!");
        productData.id = id;
        resolve(productData);
    });
});

let addProduct = (productData) => new Promise((resolve, reject) => {
    let sql = "INSERT INTO products (title, price, state, description, fk_profileid, productPicName) VALUES (" +
        db.escape(productData.title) +
        ", " + db.escape(productData.price) +
        ", " + db.escape(productData.state) +
        ", " + db.escape(productData.description) +
        ", " + db.escape(productData.fk_profileid) +
        ", " + db.escape(productData.productPicName) +
        ")";

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        } else {
            // Check if the insertId property exists in the result object
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
    let sql = `DELETE FROM products WHERE id = ${id}`;

    console.log(sql);

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected!");
        resolve();
    });
});

module.exports = {
    getProducts,
    getProductById,
    updateProduct,
    addProduct,
    deleteProduct,
}