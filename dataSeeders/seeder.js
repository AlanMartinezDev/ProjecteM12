require('dotenv').config({path: '.env'})
var bcrypt = require('bcrypt');

// Importar models
var mongoose = require('mongoose');

var Grup = require("../models/grup");
var Plantilla = require("../models/plantilla");
var User = require("../models/user");

// Carregar dades de fitxers JSON
var grupsJSON = require('./grups.json');
var usersJSON = require('./users.json');
var plantillesJSON = require('./plantilles.json');

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(
    function () {
      console.log('Mongoose connection open'); 

      seeder().then( function() {
        mongoose.connection.close();
      });
      
    }
  )
  .catch("when the error happened")

  async function seeder() {
    // Esborrar contingut col·leccions
    try {
        await User.collection.drop();
        await Grup.collection.drop();
        await Plantilla.collection.drop();
        
    } catch(error) {
        console.log('Error esborrant dades...')
    }

    var grups = await Grup.insertMany(grupsJSON.grups);
    var plantilles = await Plantilla.insertMany(plantillesJSON.plantilles);

    // REVISAR PORQUE NO SE ENCRIPTAN LAS CONTRASEÑAS
    for(var i =0; i<  usersJSON.users.length; i ++) {
      try {
        usersJSON.users[i].password =  await bcrypt.hash(usersJSON.users[i].password,12);
      } catch (error) {
        console.log(error);
      }
    }

    var users = await User.insertMany(usersJSON.users);
}