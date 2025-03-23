const mongoose = require('mongoose');

const producctSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images:[{
        type: String
    }],
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

} , {timestamps: true});

module.exports = mongoose.model('product', producctSchema);