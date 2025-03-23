const userModel = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config
const blackListModel = require("../models/blackList")
require("dotenv").config()

const Razorpay = require('razorpay');
const paymentModel = require('../models/payment')
const orderModel = require('../models/order')

var instance = new Razorpay({
  key_id: process.env.YOUR_KEY_ID,
  key_secret: process.env.YOUR_KEY_SECRET,
});

module.exports.singup = async (req, res, next) => {
    try {
        const { email, password, username, role } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ msg: "Please enter all fields" })
        }
        const isUserAlreadyExists = await userModel.findOne({ email })
        if (isUserAlreadyExists) {
            return res.status(400).json({ msg: "User already exists" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            email,
            password: hashPassword,
            username,
            role
        })

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.status(201).json({
            message: "user created successfully",
            user,
            token
        })

    } catch (e) {
        next(e)
    }
}

module.exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: "Invalid credentials" })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        res.send(200).json({
            msg: "user Signed in successfully",
            user,
            token
        })

    } catch (e) {
        next(e)
    }
}

module.exports.logOut = async (req ,res , next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(400).json({msg: "Token not provided"})
        }

        const isTokenBlackListed = await blackListModel.findOne({token})
        if(isTokenBlackListed){
            return res.status(403).json({msg: "Token is already blacklisted"})
        }
        await blackListModel.create({token})


    }catch(e){
        next(e)
    }
}

module.exports.getProfile = async (req ,res , next)=>{
    try{
        const user = await userModel.findById(req.user._id)

        res.status(200).json({
            msg:"user fetched successfully",
            user
        })

    }
    catch(e){
        next(e)
    }
}


module.exports.getProducts = async (req ,res , next)=>{
    try{
        const products = await productModel.find();
        res.status(200).json({
            message: "products fetched successfully",
            products
        })

    }
    catch(e){
        next(e)
    }

}

module.exports.getProductById = async (req ,res , next)=>{
    try{

        const product = await productModel.findById(req.params.id)
        res.status(200).json({
            message: "product fetched successfully",
            product
        })

    }
    catch(e){
        next(e)
    }

}

module.exports.createOrder = async (req , res , next)=>{
    try{
        const product = await productModel.findById(req.params.id)
        const option = {
            amount: product.amount * 100,
            currency : "INR",
            receipt : product._id

        }

        const order = await instance.orders.create(option)
        res.status(200).json({
            order
        })

        const payment = await paymentModel.create({
            order_id : order.id,
            amount: product.amount,
            currency: "INR",
            status: "pending"
        })


    }
    catch(e){
        next(e)
    }
}


module.exports.verifyPayment = async (req ,res, next)=>{
    try{
        const {paymentId , orderId , signature} = req.body
        const secret = process.env.YOUR_KEY_SECRET
        const {validatePaymentVerification}= require('../node_modules/razorpay/dist/utils/razorpay-utils.js')
        const isValid = validatePaymentVerification({
            order_id: orderId,
            payment_id: paymentId,
         
        }, signature , secret)
        if(isValid){
            const payment = await paymentModel.findOne({
                order_id : orderId
            })
            payment.paymentId = paymentId,
            payment.signature = signature,
            payment.status = "paid"

            await payment.save()
            res.status(200).json({
                message: "Payment successful",
                payment
            })
        }
        else{
            const payment = await paymentModel.findOne({
                order_id : orderId
            })
            payment.status = "failed"
            await payment.save()
            res.status(400).json({
                message: "Payment failed",
            })
        }
    }
    catch(e){
        next(e)
    }
}