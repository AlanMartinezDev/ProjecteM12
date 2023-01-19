var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var RolSchema = new Schema({
    nom: { type: String, required: true },
    permissos: [{ type: String, required: true }]
  });
  
  RolSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Rol", RolSchema);