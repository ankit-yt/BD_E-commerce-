const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    products:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment",
        required:true
    }

} , {timestamps:true})

module.exports = mongoose.model("order", orderSchema)