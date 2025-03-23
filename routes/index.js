const express = require("express")
const router = express.Router();
const indexController = require("../controller/index")
const upload = require("../config/multer.config")
const productController = require("../controller/product")

router.get("/", indexController.index )
router.post("/upload" , upload.single("img") , productController.getProducts)

module.exports = router