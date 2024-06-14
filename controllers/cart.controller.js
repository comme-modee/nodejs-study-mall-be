const Cart = require("../models/Cart");
const User = require("../models/User");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;

        //유저를 가지고 카트 찾기
        let cart = await Cart.findOne({ userId });

        if(!cart) {
            //유저가 만든 카트가 없다면, 만들어주기
            cart = new Cart({ userId });
            await cart.save();
        }

        //이미 카트에 들어가있는 아이템인지 확인
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );

        if(existItem) {
            throw new Error('아이템이 이미 카트에 있습니다.');
        }

        //카트에 아이템 추가
        cart.items = [...cart.items, { productId, size, qty }];
        await cart.save();

        res.status(200).json({ status: 'success', data: cart, cartItemQty: cart.items.length });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

cartController.useCoupon = async (req, res) => {
  try {
      const { userId } = req;
      const { type } = req.body;

      // const cart = await Cart.findOne({ userId }).populate({
      //   path: 'items',
      //   populate: {
      //     path: 'productId',
      //     model: 'Product',
      //   },
      // });

      // if (!cart) throw new Error('카트가 없습니다.');

      // console.log('카트', cart)
      
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

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({ 
            path: 'items', 
            populate: { 
                path: 'productId', 
                model: 'Product' 
            }
        });

        res.status(200).json({ status: 'success', data: cart.items });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

cartController.deleteCartItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req;
      const cart = await Cart.findOne({ userId });
      cart.items = cart.items.filter((item) => !item._id.equals(id));
  
      await cart.save();
      res.status(200).json({ status: 'success', cartItemQty: cart.items.length });
    } catch (error) {
      res.status(400).json({ status: "fail", error: error.message });
    }
};

cartController.editCartItem = async (req, res) => {
    try {
      const { userId } = req;
      const { id } = req.params;
      const { qty } = req.body;

      const cart = await Cart.findOne({ userId }).populate({
        path: 'items',
        populate: {
          path: 'productId',
          model: 'Product',
        },
      });

      if (!cart) throw new Error('카트가 없습니다.');
      const index = cart.items.findIndex((item) => item._id.equals(id));
      if (index === -1) throw new Error('Can not find item');
      cart.items[index].qty = qty;
      await cart.save();
      res.status(200).json({ status: 'success', data: cart.items });
    } catch (error) {
      return res.status(400).json({ status: 'fail', error: error.message });
    }
};

cartController.getCartQty = async (req, res) => {
    try {
      const { userId } = req;
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) throw new Error('카트가 없습니다.');
      res.status(200).json({ status: 'success', qty: cart.items.length });
    } catch (error) {
      return res.status(400).json({ status: 'fail', error: error.message });
    }
};

module.exports = cartController;
