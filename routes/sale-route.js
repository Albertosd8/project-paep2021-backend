const router = require('express').Router();
const Sale = require('../DB/models/Sale_model');
const Joi = require('joi');
const { json } = require('express');

const schema = Joi.object({
    user_email: Joi.string().required(), 
    products: Joi.array().required(), 
    Total: Joi.string().email().required(), 
    sale_added_date: Joi.date().required(), 
    sale_id: Joi.number().required(),
});

// Obtain sales
/**
 * @swagger
 * components:
 *  schemas:
 *    Sales:
 *     type: object
 *     properties:
 *       user_email: string
 *       products: array  
 *       Total: number
 *       sale_added_date: date
 *       sale_id: number
 */
/**
 * @swagger
 * /sales:
 *  get: 
 *      tags: 
 *         - Sales
 *      summary: Get the sales
 *      responses:
 *          200:
 *              description: Get sales on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Sales'
 *          404:
 *              description: Sales not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Sales'        
 */
// Obtain sales
router.get('/', async (req,res)=>{
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 0;
    const docs = await Sale.ObtainSales(skip,limit);
    if(docs){
       res.status(200).json(docs); 
       return;
    }else{
        res.status(404).send(JSON.stringify("Ocurrio un error y no se pudieron mostrar las ventas"))
    }
});

//Create new Sale 
//Create a new user
/**
 * @swagger
 * /sales:
 *  post: 
 *      tags: 
 *         - Sales
 *      summary: Creates a new sale
 * 
 *      requestBody:
 *          description: The sale to create.
 *          required: true
 *          content:
 *              application/json:        
 *                  schema:
 *                      type: object
 *                      required:
 *                          - user_email
 *                          - products
 *                          - Total
 *                          - sale_added_date
 *                      properties:
 *                          user_email:
 *                              type: string
 *                          products:
 *                              type: array
 *                          Total:
 *                              type: number
 *                          sale_added_date:
 *                              type: date
 *                  example:
 *                      user_email: elvira_lopez@example.com
 *                      products: []
 *                      Total: 60
 *                      sale_added_date: "2020-11-02"
 *      responses:
 *          201:
 *              description: Sale created on the database
 *          400:
 *              description: Cannot create sale
 */
//Create new Sale 
router.post('/', async (req,res, next)=>{ 
    const result = schema.validate(req.body);
    if (result.error) return next(result.error.details[0].message);

    let prod = await Sale.createSale(req.body);
    if(prod){
        res.status(201).send(prod)
        return;
    }else{ 
        res.status(400).send(JSON.stringify("error no se pudo crear venta"));
    }
});

module.exports = router;