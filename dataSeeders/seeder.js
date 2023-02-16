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
      console.log('BASE DE DATOS CONECTADA'); 

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

<<<<<<< HEAD
  
    var grups = await Grup.insertMany(grupsJSON.grups);
=======
>>>>>>> fceb61e6495650834cfc0ad53608206a52a2919e
    var plantilles = await Plantilla.insertMany(plantillesJSON.plantilles);
   
    // REVISAR PORQUE NO SE ENLAZAN LOS ROLES CON LOS USUARIOS
    console.log(usersJSON.users[0].rol);
    console.log(rols[6].nom);
    usersJSON.users[0].rol = [rols[6].id];
    usersJSON.users[1].rol = [rols[0].id];
    usersJSON.users[2].rol = [rols[1].id];

    
    for(var i =0; i<  usersJSON.users.length; i ++) {
      usersJSON.users[i].password =  await bcrypt.hash(usersJSON.users[i].password,12);
    }

    var users = await User.insertMany(usersJSON.users);

    grupsJSON.grups[0].membres = [users[0].id];
    grupsJSON.grups[1].membres = [users[1].id];

    var grups = await Grup.insertMany(grupsJSON.grups);
}