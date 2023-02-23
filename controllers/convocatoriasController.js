var Convocatoria = require("../models/convocatoria");
var Grup = require("../models/grup");
var Plantilla = require("../models/plantilla");

const { body, validationResult } = require("express-validator");


class convocatoriaController {

    static async list(req, res, next) {
		
        Convocatoria.find()  
        .populate({
            path: 'convocats',
            model: 'Grup',
        populate : {
            path: 'membres',
            model : 'User'
        }})  // Carregar les dades de l'objecte Publisher amb el que està relacionat    
        .populate('plantilla') // i les de tots els objectes gèneres relaciponats
        .exec(function (err, list) {
          // En cas d'error
          if (err) {
            // Crea un nou error personalitzat
            var err = new Error("There was an unexpected problem retrieving your convocatoria list");
            err.status = 404;
            // i delega el seu tractament al gestor d'errors
            return next(err);
          }
          // Tot ok: mostra el llistat
          return res.render('convocatorias/list',{list:list})
    }); 

  }
}

module.exports = convocatoriaController;