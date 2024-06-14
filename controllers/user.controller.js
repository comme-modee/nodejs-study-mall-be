const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { createCoupons } = require('../utils/createCoupons');

const userController = {};

userController.createUser = async (req, res) => {
    try {
        const { email, password, name, level } = req.body;
        const user = await User.findOne({ email: email })

        if(user) {
            throw new Error('이미 존재하는 유저입니다.')
        }

        //패스워드 암호화
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        //새 유저 저장
        const newUser = new User({ name, email, password:hash, level:level?level:'customer', coupons: createCoupons() });
        await newUser.save();
        res.status(200).json({ status: 'success' });

    } catch (error) {
        res.status(400).json({status: 'fail', error: error.message})
    }
}

userController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }, "-createdAt -updatedAt -__v");

        if(!user) {
            throw new Error('존재하지 않는 이메일입니다.');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            throw new Error('비밀번호를 다시 입력해주세요.');
        }

        const token = user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

userController.loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });

        const { email, name } = ticket.getPayload(); //email과 name을 읽어와주는 함수
        console.log('eee', email, name)
        let user = await User.findOne({ email });
        if(!user) {
            const randomPassword = "" + Math.floor(Math.random()*100000000);
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(randomPassword, salt);
            user = new User({
                name,
                email,
                password: newPassword
            });
            await user.save();
        }

        const sessionToken = await user.generateToken();
        res.status(200).json({ status: 'success', user, token: sessionToken })
    } catch (error) {
        res.status(400).json({ status: 'fail', error: error.message })
    }
}

userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if(user) {
            res.status(200).json({ status: 'success', user });
            return;
        }
        throw new Error('Invalid token')
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message })
    }
}

module.exports = userController;