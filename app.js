require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
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
const saleRoute = require('./routes/sale-route');
//Swagger
const options= {
    definition: {
        openapi: "3.0.0",
        info:{
            title:"Artisan-store",
            version:"1.0.0",
            description:"A website for online shopping for artisans products"
        },
        servers:[
        {
            url: 'http://artisan-store.herokuapp.com'
        },
        ],
    },  
    apis:['./routes/*.js']
};
const specs = swaggerJSDoc(options);
//routes
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('sales',saleRoute)
app.use('/login',loginRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(port, ()=>console.log("running..."));