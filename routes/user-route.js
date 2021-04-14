const router = require('express').Router();
const User = require('../DB/models/User_model');

// Obtain users
router.get('/', async (req,res)=>{
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 0;
    let docs = await User.ObtainUsers(skip,limit);
    console.log(docs);
    res.json(docs);
});

// Obtain user by email
router.get('/:email', async (req,res)=>{
    let doc = await User.ObtainUserByEmail(req.params.email);
    res.send(doc);
})

//Create a new user
router.post('/',validate_user, async (req,res)=>{
    let doc = await User.ObtainUserByEmail(req.body.email);
    if(doc){
        res.status(400).send({error:"Usuario ya existente en la base de datos"})
    }else{
        try{
            let usr = await User.createUser(req.body);
            res.status(201).send(usr);}
        catch(err){ 
            res.status(401).send({error:err})
        }
    }
})

//Update user
router.put('/:email',validate_user, async(req,res)=>{
    if(req.params.email == req.body.email){
        let doc;
        try{
            doc = await User.ObtainUserByEmail(req.params.email);
            console.log("update:" + doc);
            if(doc){
                await doc.updateUser(req.body);
                console.log("new"+doc);
                res.send("Usuario actualizado");
            }
        }catch(err){
                res.status(404).send({Error: "No se encontro usuario"})
        }
    }else{
        res.status(400).send({error: "no se puede cambiar el correo"})
    }
})

function validate_user(req,res,next){
    let {name, lastname, email, password, birth_date} = req.body;
    if(name && lastname && email && password && birth_date){
        next();
        return;
    }
    res.status(400).send({error:"Falta información"})
}

//Eliminar usuario
router.delete('/:email',async (req,res)=>{
    if(req.params.email == req.body.email){
        let doc;
        try{
            doc = await User.ObtainUserByEmail(req.params.email); 
            if(doc){
                await User.deleteUser(req.params.email);
                res.send('user deleted: '+ doc);
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