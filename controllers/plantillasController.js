var Plantilla = require("../models/plantilla");

const { body, validationResult } = require("express-validator");

class PlantillaController {

    static rules = [
        body("name")
          .trim()
          .isLength({ min: 1})
          .withMessage('Name must not be empty.')   
          .isLength({ max: 20})
          .withMessage('Name is too long.')       
          .escape()           
          .custom(async function(value, {req}) {  
                   
              const plantilla = await Plantilla.findOne({nom:value});          
              if (plantilla) {
                if(req.params.id!==plantilla.id ) {
                  throw new Error('This plantilla name already exists.');
                }                  
              }
              return true;        
          })    
      ];
    
    static async list(req,res,next) {
        const options = {
          page: req.query.page || 1,
          limit: 10,
          collation: {
            locale: 'en',
          },
        };

        Plantilla.paginate({}, options, function (err, result) {
            if (err) {
                return next(err);
            }  
       
              res.render('plantillas/list',{result:result}) 
        }); 		        
    }
/*
    static create_get(req, res, next) {
        var plantilla = {
          "nom" : "",
          //"puntsOrdreDia" : []
        }
        res.render('plantillas/new',{plantilla:plantilla});
    }*/
    static create_get(req, res, next) {
      var plantilla = {
        "nom" : "",
        "puntsOrdreDia" : []
      }
      res.render('plantillas/new',{plantilla:plantilla});
  }
  
/*
    static create_post(req, res,next) {
        const errors = validationResult(req);
      
        if (!errors.isEmpty()) {
          var plantilla = {
            "nom" : req.body.name,
            //"puntsOrdreDia" : []
          }
          res.render('plantillas/new',{errors:errors.array(), plantilla:plantilla})
        }
        else {
              
              Plantilla.create(req.body, function (error, newPlantilla)  {
                  if(error){
                    var err = new Error("There was a problem saving the new genre.");
                    err.status = 404;
                    return next(err);
                  }else{             
                      res.redirect('/plantillas')
                  }
              })  
        }  
    }*/

    static create_post(req, res,next) {

      console.log(req.body)
      const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        var plantilla = {
          "nom" : req.body.name,
          "puntsOrdreDia" : req.body.puntsOrdreDia
        }
        res.render('plantillas/new',{errors:errors.array(), plantilla:plantilla})
      }
      else {
          var nom = req.body.name;
          var puntsOrdreDia = req.body.puntsOrdreDia;
    
          var newPlantilla = new Plantilla({
            nom: nom,
            puntsOrdreDia: puntsOrdreDia
          });
    
          newPlantilla.save(function (error)  {
              if(error){
                var err = new Error("There was a problem saving the new template.");
                err.status = 404;
                return next(err);
              }else{             
                  res.redirect('/plantillas')
              }
          });  
      }  
  }
  

    static update_get(req, res, next) {
    
      Plantilla.findById(req.params.id, function (err, plantilla) {
          if (err) {
            return next(err);
          }
          if (plantilla == null) {

            var err = new Error("Plantilla not found");
            err.status = 404;
            return next(err);
          }

          res.render("plantillas/update", { plantilla: plantilla });
      });
    }
    /*
    static update_post(req, res, next) {
      const errors = validationResult(req);

      var plantilla = new Plantilla({
        nom: req.body.name,
        _id: req.params.id,
      });
          
      if (!errors.isEmpty()) {
        res.render("plantillas/update", { plantilla: plantilla, errors:errors.array() });
              
      }
      else {
          Plantilla.findByIdAndUpdate(
            req.params.id,
            plantilla,
            {runValidators: true},
            function (err, plantillaFound) {
              if (err) {
                //return next(err);
                res.render("plantillas/update", { plantilla: plantilla, error: err.message });

              }          

              res.render("plantillas/update", { plantilla: plantilla, message: 'Plantilla Updated'});
            }
          );
      }
    }*/
    static update_post(req, res, next) {
      const errors = validationResult(req);
    
      var plantilla = new Plantilla({
        nom: req.body.name,
        puntsOrdreDia: req.body.puntsOrdreDia,
        _id: req.params.id,
      });
          
      if (!errors.isEmpty()) {
        res.render("plantillas/update", { plantilla: plantilla, errors:errors.array() });
              
      }
      else {
          Plantilla.findByIdAndUpdate(
            req.params.id,
            {
              nom: req.body.name,
              puntsOrdreDia: req.body.punts
            },
            {runValidators: true},
            function (err, plantillaFound) {
              if (err) {
                //return next(err);
                res.render("plantillas/update", { plantilla: plantilla, error: err.message });
    
              }          
    
              res.render("plantillas/update", { plantilla: plantilla, message: 'Plantilla Updated'});
            }
          );
      }
    }
    

   static async delete_get(req, res, next) {
      res.render('plantillas/delete',{id: req.params.id})
   }
 
   static async delete_post(req, res, next) {
     
     Plantilla.findByIdAndRemove(req.params.id, function (error) {
       if(error){
         var err = new Error("Error deleting Plantilla");
         err.status = 404;
         return next(err);
       }else{
         res.redirect('/plantillas');
       }
     }) 
   }
}

module.exports = PlantillaController;

/*const Plantilla = require("../models/plantilla");

// Crear una nueva plantilla
exports.createPlantilla = (req, res) => {
  const newPlantilla = new Plantilla({
    nom: req.body.nom,
    puntsOrdreDia: req.body.puntsOrdreDia
  });

  newPlantilla.save().then(plantilla => {
    res.json(plantilla);
  });
};

// Obtener todas las plantillas
exports.getPlantillas = (req, res) => {
  Plantilla.paginate({}, { page: req.query.page || 1, limit: 10 }, (err, plantillas) => {
    res.json(plantillas);
  });
};

// Obtener una plantilla específica por su ID
exports.getPlantillaById = (req, res) => {
  Plantilla.findById(req.params.id, (err, plantilla) => {
    if (!plantilla)
      return res.status(404).send({ message: "No se encontró la plantilla con el ID especificado." });
    res.json(plantilla);
  });
};

// Actualizar una plantilla
exports.updatePlantilla = (req, res) => {
  Plantilla.findByIdAndUpdate(req.params.id, { nom: req.body.nom, puntsOrdreDia: req.body.puntsOrdreDia }, { new: true }, (err, plantilla) => {
    if (!plantilla)
      return res.status(404).send({ message: "No se encontró la plantilla con el ID especificado." });
    res.json(plantilla);
  });
};

// Eliminar una plantilla
exports.deletePlantilla = (req, res) => {
  Plantilla.findByIdAndRemove(req.params.id, (err, plantilla) => {
    if (!plantilla)
      return res.status(404).send({ message: "No se encontró la plantilla con el ID especificado." });
    res.json({ message: "Plantilla eliminada exitosamente." });
  });
};*/
