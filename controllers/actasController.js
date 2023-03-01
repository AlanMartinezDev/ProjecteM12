var Convocatoria = require("../models/convocatoria");
var Acta = require("../models/acta");

const { body, validationResult } = require("express-validator");

class ActaController {

    static async list(req, res, next) {
        Acta.find()  
            .populate('convocatoria')  // Carregar les dades de l'objecte Publisher amb el que està relacionat
            .exec(function (err, list) {
              // En cas d'error
              
              if (err) {
                // Crea un nou error personalitzat
                var err = new Error("There was an unexpected problem retrieving your acta list");
                err.status = 404;
                // i delega el seu tractament al gestor d'errors
                return next(err);
              }
              //console.log(list); // imprime los resultados en la consola para depurar
              // Tot ok: mostra el llistat
              return res.render('actas/list',{list:list})
        }); 
    }

    static async create_get(req, res, next) {

        // Fem anar la versió async-wait per recuperar dades
        // Els errors s'han de capturar amb try-catch
        try {
            const convocatoria_list = await Convocatoria.find();
  
            // En blanc, per renderitzar el formulari el primer cop
            // i que les variables existeixin a la vista
            var acta = {
                estat: '',
                descripcions: [],
                convocatoria: '',
            };
            
            // mostrem el formulari i li passem les dades necessàries
            return res.render('actas/new',
              {convocatoriaList:convocatoria_list,
               actas: acta
              })
        }
        catch(error) {
          // En cas d'error al recuperar els llistats necessaris
          // li diem al gestor d'errors que el tracti...
          var err = new Error("There was a problem showing the new acta form");
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
            const convocatoria_list = await Convocatoria.find();
        
    
            // Si no s'ha seleccionat cap checkbox 
            // hem de tenir en compte que la variable req.body.genre no existirà      
            if (typeof req.body.descripcions === "undefined") req.body.descripcions = [];
                
            // mostro formulari i li passo llistats
            // i els errors en format array per mostrar-los a usuari
            res.render('actas/new',
                  {convocatoriaList:convocatoria_list,
                   errors: errors.array(),
                   actas:req.body})
          }
          catch(error) {
              var err = new Error("There was a problem showing the new acta form");
              err.status = 404;
              return next(err);
        
          }
                 
        }
        else // cap errada en el formulari
        {    
          // Crear un array amb únicament els autors emplenats
          const descripcions = [];
          req.body.descripcions.forEach(function(desc) {
              if(desc!="") 
                descripcions.push(desc);                            
          }); 
          req.body.descripcions = descripcions;      
          
          // Si no s'ha seleccionat cap checkbox  
          if (typeof req.body.descripcions === "undefined") req.body.descripcions = [];
                
          try {      
            // req.body.title=""; // Descomenta per generar un error per provar
            var newActa = await Acta.create(req.body);
            res.redirect('/actas') 
          }
          catch(error) {
            var err = new Error("There was an unexpected problem saving your acta");
            err.status = 404;
            return next(err);
          }     
        
        }
      }

      static async update_get(req, res, next) {

        try {
          const convocatoria_list = await Convocatoria.find();
          const acta = await Acta.findById(req.params.id) 
                         .populate('convocatoria');
              
            if (acta == null) { // No results                
              var err = new Error("Acta not found");
              err.status = 404;
              return next(err);
            }
            // Successful, so render.
            res.render("actas/update", { 
                      actas: acta, 
                      convocatoriaList:convocatoria_list });
            
        }
        catch(error) {
          var err = new Error("There was an unexpected problem showing the selected acta");
          console.log(error)
          err.status = 404;
          next(err)
        }
        
      }

      static async update_post(req, res, next) {

        try {
    
          const convocatoria_list = await Convocatoria.find();
    
          const descripcions = [];
          req.body.descripcions.forEach(function(desc) {
              if(desc!="") 
                descripcions.push(desc);                            
          }); 
                  
          const acta = new Acta({
              estat: req.body.estat,
              descripcions: descripcions,
              convocatoria: req.body.convocatoria,
              _id: req.params.id, // This is required, or a new ID will be assigned!
          });
    
          // Si no s'ha seleccionat cap checkbox      
          if (typeof req.body.descripcions === "undefined") req.body.descripcions = [];
          
    
          const errors = validationResult(req);
            
          if (!errors.isEmpty()) {
                         
              res.render('actas/update',
                    { actas: acta, 
                      errors: errors.array(),
                      convocatoriaList:convocatoria_list });                 
          }
          else
          {           
            
            Acta.findByIdAndUpdate(
                req.params.id,
                acta,
                {},
                function (err, updatedActa) {
                  if (err) {
                    return next(err);
                  }
                  res.render('actas/update',
                      { actas: acta, 
                        message: 'Acta Updated',
                        convocatoriaList:convocatoria_list });
                
                });
          }
        }
        catch(error) {
          var err = new Error("There was an unexpected problem updating the acta");
          err.status = 404;
          next(err)
        }
       
      }

    // Mostrar formulari per confirmar esborrat
    static delete_get(req, res, next) {

        res.render("actas/delete",{id: req.params.id});
      
      }
    
      // Esborrar llibre de la base de dades
      static async delete_post(req, res, next) {
        
        Acta.findByIdAndRemove(req.params.id, function (error) { 
          if(error){
            var error = new Error("There was an unexpected problem deleting the acta");
            error.status = 404;
            next(error)
          }else{
            
            res.redirect('/actas')
          }
        }) 
      }
    

}

module.exports = ActaController;