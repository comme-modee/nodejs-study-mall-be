const Product = require("../models/Product");

const productController = {};
const pageSize = 5; //한페이지에 보여줄 상품갯수

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

productController.getProducts = async (req, res) => {
    try {
        const { page, name } = req.query;
        const cond = name ? {name: {$regex: name, $options: "i"}} : {};
        let query = Product.find(cond);

        if(page) {
            //5는 한페이지에 보여줄 상품갯수
            query.skip((page-1)*pageSize).limit(pageSize)
        }
        
        const productList = await query.exec();
        res.status(200).json({ status: 'success', data: productList });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

module.exports = productController;
