const orderController = {};
const Order = require('../models/Order');

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { shipTo, contact, totalPrice, orderList } = req.body;

        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList
        });

        await newOrder.save();
        
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

module.exports = orderController;
