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
        const cond = name
            ? { name: { $regex: name, $options: "i" }, isDeleted: false }
            : { isDeleted: false };
        let query = Product.find(cond);
        let response = { status: "success" };

        if(page) {
            //pageSize는 한페이지에 보여줄 상품갯수
            query.skip((page-1)*pageSize).limit(pageSize);

            const totalItemNum = await Product.find(cond).count(); //count(): 아이템의 갯수를 알수있음
            const totalPage = Math.ceil(totalItemNum/pageSize);
            response.totalPage = totalPage;
        }
        
        const productList = await query.exec();
        response.data = productList;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { sku, name, size, image, category, description, price, stock, status } = req.body;
        const product = await Product.findByIdAndUpdate(
            { _id: productId }, 
            { sku, name, size, image, category, description, price, stock, status },
            { new: true }
        )
        if(!product) throw new Error('상품이 존재하지 않습니다.');
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            { _id: productId }, 
            { isDeleted: true },
            { new: true }
        );
        if(!product) throw new Error('상품이 존재하지 않습니다.');
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
