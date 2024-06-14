const orderController = {};
const Order = require('../models/Order');
const User = require('../models/User');
const { randomStringGenerator } = require('../utils/randomStringGenerator');
const productController = require('./product.controller');
const pageSize = 10; //한페이지에 보여줄 상품갯수

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
        const orderList = await Order.find({ userId }).populate({ 
            path: 'items', 
            populate: { 
                path: 'productId', 
                model: 'Product' 
            }
        });
        res.status(200).json({ status: 'success', orderList: orderList });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.getOrderDetailInfo = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderDetailInfo = await Order.findById(orderId).populate({ 
            path: 'items', 
            populate: { 
                path: 'productId', 
                model: 'Product' 
            }
        });
        res.status(200).json({ status: 'success', orderDetailInfo: orderDetailInfo });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.getAdminOrderList = async (req, res) => {
    try {
        const { page, orderNum } = req.query;
        console.log('page', page)
        const cond = orderNum
            ? { orderNum: { $regex: orderNum, $options: "i" } }
            : {};
        let query = Order.find(cond).populate({
            path: 'items',
            populate: {
                path: 'productId',
                model: 'Product'
            }
        }).populate({
            path: 'userId', 
            model: 'User'
        });
        let response = { status: "success" };

        if(page) {
            //pageSize는 한페이지에 보여줄 상품갯수
            query.skip((page-1)*pageSize).limit(pageSize);

            const totalItemNum = await Order.find(cond).count(); //count(): 아이템의 갯수를 알수있음
            const totalPage = Math.ceil(totalItemNum/pageSize);
            response.totalPage = totalPage;
        }
        
        const adminOrderList = await query.exec();
        response.data = adminOrderList;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate({ _id: orderId }, { status }, { new: true });
        if(!order) throw new Error('주문내역이 존재하지 않습니다.');
        res.status(200).json({ status: 'success', data: order });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.useCoupon = async (req, res) => {
    try {
        const { userId } = req;
        const { type } = req.body;
        
        const user = await User.findOne({ _id: userId });
  
        user.coupons.filter((item) => {
          if(item.type === type) {
            item.valid = false;
            return;
          }
        })
  
        await user.save();
  
        res.status(200).json({ status: 'success' });
      } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message });
      }
}

module.exports = orderController;
