const express = require('express');
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/', 
    authController.authenticate, 
    authController.checkAdminPermission, 
    productController.createProduct
)

router.get('/', productController.getProducts)

router.post('/:id', 
    authController.authenticate, 
    authController.checkAdminPermission, 
    productController.updateProduct
)

router.delete('/:id', 
    authController.authenticate, 
    authController.checkAdminPermission, 
    productController.deleteProduct
)

module.exports = router;
