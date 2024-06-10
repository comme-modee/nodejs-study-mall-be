const orderController = {};
const Order = require('../models/Order');

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
            items: orderList
        });

        await newOrder.save();
        
        res.status(200).json({ status: 'success', orderNumber: });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

module.exports = orderController;
