const mongoose = require('mongoose');
require('dotenv').config();
const DBuser = process.env.MONGODB_USER;
const DBuser_p = process.env.MONGODB_PASSWORD;
const DBname = "project_paep2021";

const dbUrl = `mongodb+srv://${DBuser}:${DBuser_p}@cluster0.7pwh0.mongodb.net/${DBname}?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("Conectado a la base de datos"))
  .catch((err)=>console.log("no conectado", err))
mongoose.set('useCreateIndex', true);
 
module.exports = mongoose;