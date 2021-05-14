const router = require('express').Router();
const Product = require('../DB/models/Product_model');
const Joi = require('joi');

const schema = Joi.object({
    product_name: Joi.string().required(), 
    price: Joi.number().min(0.00).required(), 
    quantity: Joi.number().min(0.00).required(), 
    description: Joi.string().required(), 
    weight: Joi.number().min(0.00).required(),
    color: Joi.string(),
    principal_img: Joi.string().required(),
    optional_image1: Joi.string(),
    optional_image2: Joi.string(),
    name_artisan:Joi.string(),
    tags: Joi.array()
});

// Obtain products
router.get('/', async (req,res)=>{
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 0;
    const docs = await Product.ObtainProducts(skip,limit);
    res.json(docs);
});

// Obtain product by product_id
router.get('/:product_id', async (req,res)=>{
    let doc = await Product.ObtainProductById(req.params.product_id);
    res.send(doc);
})

//Create new Product CHECK CHECK
router.post('/', async (req,res, next)=>{ 
    const result = schema.validate(req.body);
    if (result.error) return next(result.error.details[0].message);

    let doc = await Product.ObtainProductByName(req.body.product_name); //check
    if(doc){
        res.status(400).send(JSON.stringify("Producto ya existente"));
        return;
    };
    try{
        let prod = await Product.createProduct(req.body);
        res.status(201).send(prod)}
    catch(err){ 
        res.status(400).send(JSON.stringify("error"));
    }
})

//Update Product
router.put('/:product_id', async(req,res,next)=>{
    const result = schema.validate(req.body);
    if (result.error) return next(result.error.details[0].message);
    
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdateProduct(req.body);
        res.send(JSON.stringify("Producto actualizado"));
        return;
    }
    else{
        res.status(404).send({Error: "No se encontro producto"})
    }
})

//Update principal image of product
router.patch('/:product_id', async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdatePrincipalImage(req.body);
        res.send(JSON.stringify("Imagen de producto actualizado"));
    }else{
        res.status(404).send({Error: "No se pudo actualizar la imagen principal"})
    }
})

//Update optional images of product
router.patch('/:product_id/optional_images', async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdateImages(req.body);
        res.send(JSON.stringify("Imagen de producto actualizado"));
    }else{
        res.status(404).send({Error: "No se pudo actualizar la imagen principal"})
    }
})

//Delete Product
router.delete('/:product_id',async (req,res)=>{
    let doc = await Product.ObtainProductById(req.params.product_id);
    if(doc){ 
        await Product.deleteProduct(req.params.product_id);
        res.status(200).send(JSON.stringify('Producto eliminado'));
    }else{
        res.status(404).send({Error: "No se encontro producto"});
    } 
})


module.exports = router;