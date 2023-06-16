const db = require("../services/database").config;
const bcrypt = require("bcrypt");

// Handles the database calls for the product routes
let getProducts = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM products", function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(products);
            resolve(products);
        }
    });
});

let getProductById = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products WHERE id = ${id}`, function (err, product, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(product[0]);
            resolve(product[0]);
        }
    });
});


let updateProduct = (productData, id) => new Promise(async (resolve, reject) => {
    productData.password = await bcrypt.hash(productData.password, 10);
    let sql = "UPDATE products SET " +
        "name = " + db.escape(productData.name) +
        ", email = " + db.escape(productData.email) +
        ", info = " + db.escape(productData.info) +
        ", password = " + db.escape(productData.password) +
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

let addProduct = (productData) => new Promise(async (resolve, reject) => {
    productData.password = await bcrypt.hash(productData.password, 10);
    let sql = "INSERT INTO products (name, email, info, password) VALUES (" +
        db.escape(productData.name) +
        ", " + db.escape(productData.email) +
        ", " + db.escape(productData.info) +
        ", " + db.escape(productData.password) + ")";

    console.log(sql);

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        productData.id = result.insertId;
        resolve(productData);
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