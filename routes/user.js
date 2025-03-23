const express = require('express');
const router = express.Router();
const userController = require("../controller/user")
const authMiddleware = require("../middlewares/auth")

router.post("/signup" , userController.singup)
router.post("/login" , userController.signin)
router.post("/logout" , userController.logOut)
router.get("/profile" , authMiddleware.isAuthenicated , userController.getProfile)
router.get("/products" , authMiddleware.isAuthenicated , userController.getProducts )
router.get("/products/:id" , authMiddleware.isAuthenicated , userController.getProductById)
router.get("/order/:id" , authMiddleware.isAuthenicated , userController.createOrder)
router.get("/verify" , authMiddleware.isAuthenicated , userController.verifyPayment)

module.exports = router