const express = require('express')
const router = express.Router()
const productModel = require("../models/product")
const upload = require("../config/multer.config")
const authMiddleware = require("../middlewares/auth")
const productController = require("../controller/product")


router.post("/create-product" , upload.any() , authMiddleware.isAuthenicated , authMiddleware.isSeller,  productController.getProducts)

module.exports = router 