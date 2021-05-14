const router = require('express').Router();
const User = require('../DB/models/User_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/',async (req,res)=>{ 
    let{ email, password } = req.body;
    if(email && password){ 
        let usuario = await User.ObtainUserByEmail(email);
        if(usuario){
            if(bcrypt.compareSync(password, usuario.password)){ 
                let token = jwt.sign({email: usuario.email},"clavesecreta",{ expiresIn: '3hr'});
                res.send({token});
            }else{
                res.status(401).send({error:"Verifique usuario y contraseña"});
            }
        }else{
            res.status(404).send({error:"Usuario no encontrado"})
        }
    }else{
        res.status(400).send({error:"Datos faltantes"})
    }
});

module.exports = router;