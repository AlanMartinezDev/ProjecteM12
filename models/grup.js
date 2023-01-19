var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var GrupSchema = new Schema({
    nom: { type: String, required: true },
    tipus: { type: String, required: true }
  });
  
  GrupSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Grup", GrupSchema);