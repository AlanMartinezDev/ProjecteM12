var express = require("express");
var middelware = require("../middlewares/authenticate");
var router = express.Router();

const plantilla_controller = require("../controllers/plantillasController");

router.use([middelware.isAuth,middelware.hasRole('administrador')]);

router.get("/", plantilla_controller.list);

router.get("/create", plantilla_controller.create_get);
router.post("/create", plantilla_controller.rules,plantilla_controller.create_post);

router.get("/delete/:id", plantilla_controller.delete_get);
router.post("/delete/:id", plantilla_controller.delete_post);

router.get("/update/:id", plantilla_controller.update_get);
router.post("/update/:id", plantilla_controller.rules, plantilla_controller.update_post);


module.exports = router;

/*var express = require("express");
var router = express.Router();
//var Plantilla = require("../models/plantilla");
var PlantillaController = require("../controllers/plantillasController");

// Get all Plantillas
router.get("/", PlantillaController.getAll);

// Get Plantilla by ID
router.get("/:id", PlantillaController.getById);

// Create new Plantilla
router.post("/", PlantillaController.create);

// Update Plantilla by ID
router.put("/:id", PlantillaController.update);

// Delete Plantilla by ID
router.delete("/:id", PlantillaController.delete);

module.exports = router;*/
