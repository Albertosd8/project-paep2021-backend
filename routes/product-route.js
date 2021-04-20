const router = require('express').Router();
const Product = require('../DB/models/Product_model');

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
router.post('/',validate_product, async (req,res)=>{ 
    let doc = await Product.ObtainProductByName(req.body.product_name); //check
    if(doc){
        res.status(400).send({error:"Producto ya existente"})
    }
    try{
        let prod = await Product.createProduct(req.body);
        res.status(201).send(prod)}
    catch(err){ 
        res.status(400).send({error:err});
    }
})

//Update Product
router.put('/:product_id',validate_product, async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdateProduct(req.body);
        res.send("Producto actualizado");
    }else{
            res.status(404).send({Error: "No se encontro producto"})
    }
})

//Update principal image of product
router.patch('/:product_id', async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdatePrincipalImage(req.body);
        res.send("Imagen de producto actualizado");
    }else{
        res.status(404).send({Error: "No se pudo actualizar la imagen principal"})
    }
})

//Update optional images of product
router.patch('/:product_id/optional_images', async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdateImages(req.body);
        res.send("Imagen de producto actualizado");
    }else{
        res.status(404).send({Error: "No se pudo actualizar la imagen principal"})
    }
})

//Delete Product
router.delete('/:product_id',async (req,res)=>{
    let doc = await Product.ObtainProductById(req.params.product_id);
    if(doc){ 
        await Product.deleteProduct(req.params.product_id);
        res.status(200).send('Producto eliminado!'+ doc);
    }else{
        res.status(404).send({Error: "No se encontro producto"});
    } 
})

function validate_product(req,res,next){
    let {product_name, price, quantity, description, weight, color, principal_img} = req.body;
    if(product_name && price && quantity && description && weight && color && principal_img){
        next();
        return;
    }
    res.status(400).send({error:"Falta información"})
}


module.exports = router;