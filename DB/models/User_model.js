const mongoose = require('../mongoDB_connect');
const { mongo } = require('mongoose');
const Product = require('./Product_model');
const bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    user_id:{
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password: {
        type:String,
        required: true
    },
    birth_date:{
        type:Date,
        required: true
    },
    shopping_history: [{
        type:String, 
        ref: Product
    }],
    rol: {
        type: String,
        enum: ["USER", "ADMIN", "ARTISAN"]
      },
    status: {
        type: Boolean 
      }
});

userSchema.statics.ObtainUsers = function(skip, limit){
    return User.find({},{_id:0,user_id:1, name:1, lastname:1, email:1, birth_date:1, rol:1, status:1})
                .skip(skip)
                .limit(limit);
};

userSchema.statics.ObtainUserByEmail = function(email){
    return User.findOne({email});
};

userSchema.statics.createUser = (UserData)=>{
    UserData.user_id = new Date().valueOf(); //or Date.now() + Math.random()
    UserData.password = bcrypt.hashSync(UserData.password,8);
    UserData.status = true;
    let NewUser = User(UserData);
    return NewUser.save();
};

userSchema.statics.deleteUser = function(email){
    return User.findOneAndDelete({email});
};

userSchema.methods.updateUser = function(datos){
    return User.findOneAndUpdate(
        {_id:this._id},
        {$set:{"name": datos.name,
        "lastname":datos.lastname,
        "email":datos.email,
        "password" : (bcrypt.hashSync(datos.password,8)),
        "birth_date":datos.birth_date,
        "uid":datos.uid
    }},
        {new:true,
         useFindAndModify:false}
        )
};

const User = mongoose.model('users',userSchema); //modelo de usuarios

module.exports = User;