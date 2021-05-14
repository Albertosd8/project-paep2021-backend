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
router.get('/', async (req,res)=>{
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 0;
    const docs = await User.ObtainUsers(skip,limit);
    res.json(docs);
});

// Obtain user by email
router.get('/:email', async (req,res)=>{
    let doc = await User.ObtainUserByEmail(req.params.email);
    res.send(doc);
})

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