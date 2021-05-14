require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//MIDDDLEWARES
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use(cors())
//Import routes
const userRoute = require('./routes/user-route');
const productRoute = require('./routes/product-route');
const loginRoute = require('./routes/login-route');
//routes
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/login',loginRoute);

app.listen(port, ()=>console.log("running..."));