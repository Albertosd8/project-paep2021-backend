const mongoose = require('../mongodb_connect');
const { mongo } = require('mongoose');

let productSchema = mongoose.Schema({
    product_id: {
        type: Number,
        required: true,
        unique: true 
    },
    product_name: {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        min: 0.00,
        required: true,
    },
    quantity:{
        type:Number,
        min: 0,
        required: true,
    },
    description: {
        type:String,
        required: true,
    },
    color:{
        type:String,
        enum: ['BLACK','WHITE','GREY','RED','ORANGE','YELLOW','GREEN','BLUE','PURPLE','PINK','BROWN']
    },
    weight:{
        type: Number,
        min: 0.00,
    },
    principal_img:{
        type:String,
        required:true
    },
    optional_image1:{
        type:String
    },
    optional_image2:{
        type:String
    },
    name_artisan:{
        type: String,
        required:true
    },
    tags:[{type:String}]
})

//Obtain list of products
productSchema.statics.ObtainProducts = function(skip, limit){
    return Product.find({},{_id:0,product_id:1, product_name:1, price:1, quantity:1,
        description:1, color:1, weight:1, principal_img:1, optional_image1:1, optional_image2:1,
        name_artisan:1, tags:1})
                .skip(skip)
                .limit(limit);
}

//Obtain product by ID
productSchema.statics.ObtainProductById = function(product_id){
    return Product.findOne({product_id});
}

productSchema.statics.ObtainProductByName = function(product_name){
    return Product.findOne({product_name});
}

//Create product
productSchema.statics.createProduct = (ProdData)=>{
    ProdData.product_id = new Date().valueOf();
    console.log(ProdData);
    let NewProd = Product(ProdData);
    return NewProd.save();
}
//Delete product
productSchema.statics.deleteProduct = function(product_id){
    return Product.findOneAndDelete({product_id});
}

//Update product
productSchema.methods.UpdateProduct = function(data){
    return Product.findOneAndUpdate(
        {_id:this._id},
        {$set:data},
        {new:true,
         useFindAndModify:false}
        )
}

//Update principal image of product
productSchema.methods.UpdatePrincipalImage = function(datos){
    return Product.findOneAndUpdate(
        {_id:this._id},
        {$set:{"principal_img":datos.principal_img}},
        {new:true,
         useFindAndModify:false}
        )
}

//Update second and third images
productSchema.methods.UpdateImages = function(data){
    return Product.findOneAndUpdate(
        {_id:this._id},
        {$set:{"optional_image1":data.optional_image1, "optional_image2":data.optional_image2}},
        {new:true,
         useFindAndModify:false}
        )
}

const Product = mongoose.model('products',productSchema); //modelo de usuarios

module.exports = Product;