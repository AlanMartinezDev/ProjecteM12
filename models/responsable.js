var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var ResponsableSchema = new Schema({
    nom: { type: String, required: true },
    rol: [{ type: Schema.ObjectId, ref: "Rol" }]
  });
  
  ResponsableSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Responsable", ResponsableSchema);