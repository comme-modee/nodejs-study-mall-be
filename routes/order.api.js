const express = require('express');
const authController = require('../controllers/auth.controller');
const orderController = require('../controllers/order.controller');
const router = express.Router();

router.post('/', 
    authController.authenticate, 
    orderController.createOrder
);

//본인 오더 리스트 불러오기(낫 어드민)
router.get('/', 
    authController.authenticate, 
    orderController.getOrderList
);

//본인 오더 디테일 리스트 불러오기(낫 어드민)
router.get('/detail/:id',
    authController.authenticate, 
    orderController.getOrderDetailInfo
)

//오더 전체 리스트 불러오기(어드민)
router.get('/entire', 
    authController.authenticate, 
    authController.checkAdminPermission,
    orderController.getAdminOrderList
);

router.put('/:id', 
    authController.authenticate, 
    authController.checkAdminPermission,
    orderController.updateOrder
);

router.post('/coupon', 
    authController.authenticate, 
    orderController.useCoupon
);

module.exports = router;