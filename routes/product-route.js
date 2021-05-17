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
/**
 * @swagger
 * components:
 *  schemas:
 *    Products:
 *     type: object
 *     properties:
 *       product_name: string
 *       price: number  
 *       quantity: number
 *       description: string
 *       weight: number
 *       color: string
 *       principal_img: string
 *       optional_image1: string
 *       optional_image2: string
 *       name_artisan: string
 *       tags: array
 */
/**
 * @swagger
 * /products:
 *  get: 
 *      tags: 
 *         - Product
 *      summary: Get the products
 *      responses:
 *          200:
 *              description: Get products on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'
 *          404:
 *              description: Products not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'        
 */
// Obtain products
router.get('/', async (req,res)=>{
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 0;
    const docs = await Product.ObtainProducts(skip,limit);
    if(docs){
       res.status(200).json(docs); 
       return;
    }else{
        res.status(404).send(JSON.stringify("Ocurrio un error y no se pudieron mostrar los productos"))
    }
});

// Obtain product by product_id
/**
 * @swagger
 *  /products/{product_id}:
 *   get: 
 *      tags: 
 *         - Product
 *      summary: Get a specific user
 *      parameters:
 *        - in: path
 *          description: The product id
 *          name: product_id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *      responses:
 *          200:
 *              description: Get product by product id on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'
 *          404:
 *              description: Product not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'    
 */
// Obtain product by product_id
router.get('/:product_id', async (req,res)=>{
    let doc = await Product.ObtainProductById(req.params.product_id);
    if(doc){
        res.status(200).send(doc);
    }else{
        res.status(404).send(JSON.stringify("No se encontro el producto"));
    }
});

//Create new Product 
/**
 * @swagger
 * /products:
 *  post: 
 *      tags: 
 *         - Product
 *      summary: Creates a new product
 * 
 *      requestBody:
 *          description: The product to create.
 *          required: true
 *          content:
 *              application/json:        
 *                  schema:
 *                      type: object
 *                      required:
 *                          - product_name
 *                          - price
 *                          - quantity
 *                          - description
 *                          - color
 *                          - weight
 *                          - principal_img
 *                          - optional_image1
 *                          - optional_image2
 *                          - name_artisan
 *                          - tags
 *                      properties:
 *                          product_name:
 *                              type: string
 *                          price:
 *                              type: number
 *                          quantity:
 *                              type: number
 *                          description:
 *                              type: string
 *                          color:
 *                              type: string
 *                          weight:
 *                              type: number
 *                          principal_img:
 *                              type: string
 *                          optional_image1:
 *                              type: string
 *                          optional_image2:
 *                              type: string
 *                          name_artisan:
 *                              type: string
 *                          tags:
 *                              type: array
 *                  example:
 *                      product_name: Botella
 *                      price: 10.00
 *                      quantity: 10
 *                      description: Botella de vidrio soplado transparente con colores azulados
 *                      color: GREEN
 *                      weight: 5.00
 *                      principal_img: "https://static.zarahome.net/8/photos4/2021/V/4/1/p/6372/043/802/01/6372043802_1_1_2.jpg?t=1616685744602"
 *                      optional_image1: "link for second imp"
 *                      optional_image2: "link for third imp"
 *                      name_artisan: Josefino Torres
 *                      tags: []
 *      responses:
 *          201:
 *              description: Product created on the database
 *          400:
 *              description: Product already exists on the database (check product name)
 *          401:
 *              description: Product couldn't be posted to the database         
 */
//Create new Product 
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
});


//Update principal image of product
/**
 * @swagger
 * /products:
 *  patch: 
 *      tags: 
 *         - Product
 *      summary: Updates a product principal image
 *      
 *      parameters:
 *        - in: path
 *          description: The product id
 *          name: product_id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *      
 *      requestBody:
 *          description: The product image link to update.
 *          required: true
 *          content:
 *              application/json:        
 *                  schema:
 *                      type: object
 *                      required:
 *                          - principal_img
 *                      properties:
 *                          principal_img:
 *                              type: string
 *                  example:
 *                      principal_img: "https://static.zarahome.net/8/photos4/2021/V/4/1/p/6372/043/802/01/6372043802_1_1_2.jpg?t=1616685744602"
 *      responses:
 *          201:
 *              description: Product image updated on the database
 *          404:
 *              description: Product image cannot be updated on the database
 */
//Update principal image of product
router.patch('/:product_id', async(req,res)=>{
    let doc= await Product.ObtainProductById(req.params.product_id);
    if(doc){
        await doc.UpdatePrincipalImage(req.body);
        res.status(200).send(JSON.stringify("Imagen de producto actualizado"));
    }else{
        res.status(404).send({Error: "No se pudo actualizar la imagen principal"})
    }
});

//Delete Product
/**
 * @swagger
 *  /users/{product_id}:
 *   delete: 
 *      tags: 
 *         - Product
 *      summary: Delete a specific product
 *      parameters:
 *        - in: path
 *          description: The product id
 *          name: product_id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *      responses:
 *          200:
 *              description: Delete Product by product id on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'
 *          400:
 *              description: Product cannot be deleted by product id on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'
 *          404:
 *              description: Product not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Products'    
 */
//Delete Product
router.delete('/:product_id',async (req,res)=>{
    let doc = await Product.ObtainProductById(req.params.product_id);
    if(doc){ 
        await Product.deleteProduct(req.params.product_id);
        res.status(200).send(JSON.stringify('Producto eliminado'));
    }else{
        res.status(404).send({Error: "No se encontro producto"});
    } 
});


module.exports = router;