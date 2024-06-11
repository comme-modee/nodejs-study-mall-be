const orderController = {};
const Order = require('../models/Order');
const { randomStringGenerator } = require('../utils/randomStringGenerator');
const productController = require('./product.controller');

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { shipTo, contact, totalPrice, orderList } = req.body;

        const insufficientStockItems = await productController.checkItemListStock(orderList);

        if(insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, "");
            throw new Error(errorMessage);
        }

        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomStringGenerator()
        });

        await newOrder.save();
        
        res.status(200).json({ status: 'success', orderNum: newOrder.orderNum });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.getOrderList = async (req, res) => {
    try {
        const { userId } = req;
        const orderList = await Order.findOne({ userId });
        res.status(200).json({ status: 'success', orderList: orderList });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

module.exports = orderController;
