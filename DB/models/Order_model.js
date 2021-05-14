const mongoose = require('../mongodb_connect');
const { mongo } = require('mongoose');
const Product = require('./Product_model');

let orderSchema = mongoose.Schema({
    order_id: {
        type: Number,
        required: true,
        unique:true
    },
    user_id:{
        type: Number,
        required
    },
    products:[{type:String, ref: Product}],
    total: {
        type:Number,
        min: 0.00,
        required: true,
    },
    register_date:{
        type:Date,
        required: true,
    },
    delivery_date:{
        type:Date,
        min:22-03-2021,
        required: true,
    },
    address:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        required: true
    }
})



const Order = mongoose.model('orders',orderSchema); //modelo de pedidos
module.exports = Order;