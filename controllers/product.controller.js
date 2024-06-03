const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, category, description, price, stock, status } = req.body;
        const newProduct = new Product({ sku, name, size, image, category, description, price, stock, status });
        await newProduct.save();
        res.status(200).json({ status: 'success', newProduct });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

module.exports = productController;