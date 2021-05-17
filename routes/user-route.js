const router = require('express').Router();
const User = require('../DB/models/User_model');
const Joi = require('joi');
const { json } = require('express');

const schema = Joi.object({
    name: Joi.string().required(), 
    lastname: Joi.string().required(), 
    email: Joi.string().email().required(), 
    password: Joi.string().min(6).required(), 
    birth_date: Joi.date().required(),
    shopping_history: Joi.array(),
    rol: Joi.string().required()
});

// Obtain users
/**
 * @swagger
 * components:
 *  schemas:
 *    Users:
 *     type: object
 *     properties:
 *       name: string
 *       lastname: string  
 *       email: string
 *       birth_date: date
 *       shopping_history: string
 *       rol: string
 */
/**
 * @swagger
 * /users:
 *  get: 
 *      tags: 
 *         - User
 *      summary: Get the users
 *      responses:
 *          200:
 *              description: Get users on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Users'
 *          404:
 *              description: Users not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/Users'        
 */
// Obtain users
router.get('/', async (req,res)=>{
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 0;
    const docs = await User.ObtainUsers(skip,limit);
    if(docs){
        res.status(200).json(docs);
        return;
    }else{
        res.status(404).send(JSON.stringify("Ocurrio un error y no se pudieron mostrar los usuarios"))
    }
});

// Obtain user by email
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *     type: object
 *     properties:
 *       user_id: number
 *       name: string
 *       lastname: string  
 *       email: string
 *       password: string
 *       birth_date: date
 *       shopping_history: string
 *       rol: string
 */
/**
 * @swagger
 *  /users/{email}:
 *   get: 
 *      tags: 
 *         - User
 *      summary: Get a specific user
 *      parameters:
 *        - in: path
 *          description: The user email
 *          name: email
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *      responses:
 *          200:
 *              description: Get user by email on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *          404:
 *              description: User not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/User'    
 */
// Obtain user by email
router.get('/:email', async (req,res)=>{
    let doc = await User.ObtainUserByEmail(req.params.email);
    if(doc){
       res.status(200).send(doc); 
       return;
    }else{
       res.status(404).send(JSON.stringify("No se encontro el usuario"));
    }
})

//Create a new user
/**
 * @swagger
 * /users:
 *  post: 
 *      tags: 
 *         - User
 *      summary: Creates a new user
 * 
 *      requestBody:
 *          description: The user to create.
 *          required: true
 *          content:
 *              application/json:        
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - lastname
 *                          - email
 *                          - password
 *                          - birth_date
 *                          - rol
 *                      properties:
 *                          name:
 *                              type: string
 *                          lastname:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          birth_date:
 *                              type: date
 *                          shopping_history:
 *                              type: array
 *                          rol:
 *                              type: string
 *                  example:
 *                      name: Elvira
 *                      lastname: Lopez
 *                      email: elvira_lopez@example.com
 *                      password: "82492724"
 *                      birth_date: 1999-10-10
 *                      shopping_history: []
 *                      rol: USER
 *      responses:
 *          201:
 *              description: User created on the database
 *          400:
 *              description: User already exists on the database
 *          401:
 *              description: User couldn't be posted to the database         
 */
//Create a new user
router.post('/', async (req,res, next)=>{
    const result = schema.validate(req.body);
    if (result.error) return next(result.error.details[0].message);

    let doc = await User.ObtainUserByEmail(req.body.email);
    if(doc){ 
        res.status(400).send(JSON.stringify("Usuario ya existente en la base de datos"))
        return;
    };
    try{
        let usr = await User.createUser(req.body);
        res.status(201).send(usr);}
    catch(err){ 
        res.status(401).send(JSON.stringify("Ha ocurrido un error intenta de nuevo"))
    }
})

//Update user
router.put('/:email', async(req,res, next)=>{
    const result = schema.validate(req.body);
    if (result.error) return next(result.error.details[0].message);

    let doc;
    try{
        doc = await User.ObtainUserByEmail(req.params.email);
        if(doc){
            await doc.updateUser(req.body);
            res.status(200).send(JSON.stringify("Usuario actualizado"));
        }
    }catch(err){
            res.status(404).send({Error: "No se encontro usuario"})
    }
})


//Eliminar usuario
/**
 * @swagger
 *  /users/{email}:
 *   delete: 
 *      tags: 
 *         - User
 *      summary: Delete a specific user
 *      parameters:
 *        - in: path
 *          description: The user email
 *          name: email
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *      responses:
 *          200:
 *              description: Delete user by email on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *          400:
 *              description: User cannot be deleted by email on the database
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *          404:
 *              description: User not found
 *              contents:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              items:
 *                                  $ref: '#/components/schemas/User'    
 */
//Eliminar usuario
router.delete('/:email',async (req,res)=>{
    if(req.params.email == req.body.email){
        let doc;
        try{
            doc = await User.ObtainUserByEmail(req.params.email); 
            if(doc){
                await User.deleteUser(req.params.email);
                res.status(200).send(JSON.stringify('user deleted: '+ doc));
            }else{
                throw "err";
            }
        }catch(err){
                res.status(404).send({Error: "No se encontro usuario"})
        } 
    }else{
        res.status(400).send({error: "no se puede eliminar el usuario"})
    }
})

module.exports = router;