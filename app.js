require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
app.use(cors())


const connectDB = require("./config/mogodb")
const path = require("path")
connectDB()
const indexRoutes = require("./routes/index")
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")


app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/" , indexRoutes)
app.use("/user" , userRoutes)
app.use("/product" , productRoutes)

app.listen(3000)