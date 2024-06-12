const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if(!tokenString) throw new Error('Token not found');
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if(error) throw new Error('Invalid token');
            req.userId = payload._id;
        })
        console.log('1')
        next();
    } catch (error) {
        res.status(400).json({status: 'fail', error: error.message})
    }
}

authController.checkAdminPermission = async (req, res, next) => {
    try {
        console.log('2')
        const { userId } = req;
        const user = await User.findById(userId);
        if(user.level !== 'admin') throw new Error('No permission');
        next();
    } catch (error) {
        res.status(400).json({status: 'fail', error: error.message})
    }
}

module.exports = authController;
