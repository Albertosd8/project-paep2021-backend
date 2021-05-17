const mongoose = require('../mongodb_connect');
const { mongo } = require('mongoose');

let salesSchema = mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    products:{
        type: Array,
        required: true
    },
    Total: {
        type:Number,
        min: 0.00,
        required: true,
    },
    sale_added_date:{
        type:Date,
        required: true,
    },
    sale_id:{
        type:Number,
        required: true,
        unique:true
    }
})

salesSchema.statics.ObtainSales = function(skip, limit){
    return Sale.find({},{_id:0, user_email:1,products:1, Total:1, sale_added_date:1, sale_id:1})
                .skip(skip)
                .limit(limit);
};

salesSchema.statics.createSale = (saleData)=>{
    saleData.sale_id = new Date().valueOf(); 
    let NewSale = Sale(saleData);
    return NewSale.save();
};

const Sale = mongoose.model('sales',salesSchema); //modelo de pedidos
module.exports = Sale;