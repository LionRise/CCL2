const db = require("../services/database").config;

// Handles the database calls for the product routes
let getProducts = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM products", function (err, products, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(products, "getProducts");
            resolve(products);
        }
    });
});

let getProductById = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT * FROM products WHERE id = ${id}`, function (err, product, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(product[0],"getProductById");
            resolve(product[0]);
        }
    });
});


let updateProduct = (productData, id) => new Promise(async (resolve, reject) => {
    let sql = "UPDATE products SET " +
        "title = " + db.escape(productData.title) +
        ", price = " + db.escape(productData.price) +
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

let addProduct = (productData) => new Promise(async (resolve, reject) => {
    let sql = "INSERT INTO products (title, price, description) VALUES (" +
        db.escape(productData.title) +
        ", " + db.escape(productData.price) +
        ", " + db.escape(productData.description) + ")";

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