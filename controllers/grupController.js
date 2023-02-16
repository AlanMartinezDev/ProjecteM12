var Grup = require("../models/grup");
var User = require("../models/user");

const { body, validationResult } = require("express-validator");

class GrupController {
    static rules = [
        // Validate and sanitize fields.
        body("nom", "Nom must not be empty.")
          .trim()
          .isLength({ min: 1 })
          .escape(),  
        body("tipus", "Tipus must not be empty.")
          .trim()
          .isLength({ min: 1 }),
          /*
        body("dni")
          .trim() 
          .isLength({ min: 1, max: 9 })
          .withMessage('DNI must have a valid format.')        
          .custom(async function(value, {req}) {
             
              const member = await User.findOne({dni:value});
              
              if (member) {
                if(req.params.id!==member.id ) {
                  throw new Error('Esta persona ya pertenece a un grupo.');
                }             
                
              }
              return true;        
          })
          .withMessage('DNI must be unique.'),*/
      ];
    
    	static async list(req, res, next) {
        Grup.find()  
            .populate('membres')  // Carregar les dades de l'objecte Publisher amb el que està relacionat
            .exec(function (err, list) {
              // En cas d'error
              /*
              if (err) {
                // Crea un nou error personalitzat
                //var err = new Error("There was an unexpected problem retrieving your book list");
                //err.status = 404;
                // i delega el seu tractament al gestor d'errors
                return next(err);
              } */
              console.log(list); // imprime los resultados en la consola para depurar
              // Tot ok: mostra el llistat
              return res.render('grups/list',{list:list})
        }); 
    }

    static async create_get(req, res, next) {

      // Fem anar la versió async-wait per recuperar dades
      // Els errors s'han de capturar amb try-catch
      try {
          const users_list = await User.find();

          // En blanc, per renderitzar el formulari el primer cop
          // i que les variables existeixin a la vista
          var grup = {
              nom: '',
              tipus: '',
              membres: [],
          };
          
          // mostrem el formulari i li passem les dades necessàries
          return res.render('grups/new',
            {usersList:users_list,
             grups: grup
            })
      }
      catch(error) {
        // En cas d'error al recuperar els llistats necessaris
        // li diem al gestor d'errors que el tracti...
        var err = new Error("There was a problem showing the new book form");
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
        var users_list = await User.find();
    

        // Si no s'ha seleccionat cap checkbox 
        // hem de tenir en compte que la variable req.body.genre no existirà      
        if (typeof req.body.user === "undefined") req.body.user = [];
            
        // mostro formulari i li passo llistats
        // i els errors en format array per mostrar-los a usuari
        res.render('grups/new',
              {usersList:users_list,
               errors: errors.array(),
               grups:req.body})
      }
      catch(error) {
          var err = new Error("There was a problem showing the new book form");
          err.status = 404;
          return next(err);
    
      }
             
    }
    else // cap errada en el formulari
    {    
      // Crear un array amb únicament els autors emplenats
      const users = [];
      req.body.user.forEach(function(user) {
          if(user.name!="") 
            users.push(user);                            
      }); 
      req.body.user = users;      

      // Si no s'ha seleccionat cap checkbox  
      if (typeof req.body.user === "undefined") req.body.user = [];
            
      try {      
        // req.body.title=""; // Descomenta per generar un error per provar
        var newGrup = await Grup.create(req.body);
        res.redirect('/grups') 
      }
      catch(error) {
        var err = new Error("There was an unexpected problem saving your book");
        err.status = 404;
        return next(err);
      }     
    
    }
  }
}

module.exports = GrupController;