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

  static async create_get(req, res, next) {

    // Fem anar la versió async-wait per recuperar dades
    // Els errors s'han de capturar amb try-catch
    try {
        const grups_list = await Grup.find();
        const plantillas_list = await Plantilla.find();

        // En blanc, per renderitzar el formulari el primer cop
        // i que les variables existeixin a la vista
        var convocatoria = {
            data: '',
            horaInici: '',
            durada: '',
            lloc: '',
            puntsOrdreDia: [],
            convocats: [],
            plantilla: ''
        };
        
        // mostrem el formulari i li passem les dades necessàries
        return res.render('convocatorias/new',
          {grupsList:grups_list,
           plantillasList:plantillas_list,
           convo: convocatoria
          })
    }
    catch(error) {
      // En cas d'error al recuperar els llistats necessaris
      // li diem al gestor d'errors que el tracti...
      var err = new Error("There was a problem showing the new convocatoria form");
      err.status = 404;
      return next(err);
      
    }
  }

  static async create_post(req, res, next) {

    // Recuperem els errors possibles de validació
    const errors = validationResult(req);
    
    // Tenim errors en les dades enviades
    if (!errors.isEmpty()) {

      try {
        // Recupero llistats necessaris
        var grups_list = await Grup.find();
        var plantillas_list = await Plantilla.find();
            
        // mostro formulari i li passo llistats
        // i els errors en format array per mostrar-los a usuari
        res.render('convocatorias/new',
              {grupsList:grups_list,
               plantillasList:plantillas_list,
               errors: errors.array(),
               convocatoria:req.body})
      }
      catch(error) {
          var err = new Error("There was a problem showing the new convocatoria form");
          err.status = 404;
          return next(err);
    
      }
             
    }
    else // cap errada en el formulari
    {    
      //const horaIniciDate = new Date(req.body.horaInici);
      //const horaInici = horaIniciDate.getHours() + ':' + horaIniciDate.getMinutes();

      // Obtener el valor del input tipo time
      //const horaIniciInput = document.querySelector('input[name="horaInici"]');
      const horaIniciValue = req.body.horaInici;

      // Convertir el valor a un string en formato HH:MM
      const horaIniciDate = new Date();
      const [hours, minutes] = horaIniciValue.split(':');
      horaIniciDate.setHours(hours, minutes);
      const horaIniciString = horaIniciDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

       // Asignar la hora de inicio formateada a la propiedad horaInici de req.body
       req.body.horaInici = horaIniciString;

      // Crear un array amb únicament els autors emplenats
      const grups = [];
      req.body.convocats.forEach(function(grup) {
          if(grup!="") 
            grups.push(grup);                            
      }); 
      req.body.convocats = grups;      

      // Si no s'ha seleccionat cap checkbox  
      if (typeof req.body.convocats === "undefined") req.body.convocats = [];

      // Crear un array amb únicament els autors emplenats
      const punts = [];
      req.body.puntsOrdreDia.forEach(function(punt) {
          if(punt!="") 
            punts.push(punt);                            
      }); 
      req.body.puntsOrdreDia = punts;      

      // Si no s'ha seleccionat cap checkbox  
      if (typeof req.body.puntsOrdreDia === "undefined") req.body.puntsOrdreDia = [];
            
      try {      
        // req.body.title=""; // Descomenta per generar un error per provar
        var newConvocatoria = await Convocatoria.create(req.body);
        res.redirect('/convocatorias') 
      }
      catch(error) {
        var err = new Error("There was an unexpected problem saving your convocatoria");
        err.status = 404;
        return next(err);
      }     
    
    }
  }

}

module.exports = convocatoriaController;