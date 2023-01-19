var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var PlantillaSchema = new Schema({
    nom: { type: String, required: true },
    puntsOrdreDia: [{ type: String, required: true }]
  });
  
  PlantillaSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Plantilla", PlantillaSchema);