var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var ActaSchema = new Schema({
    estat: {
      type: String,
      enum: [
        "Oberta","Tancada"     
      ],
      default: "Oberta"
    },
    descripcions: [{ type: String, required: true }],
    //acords: [{ type: Schema.ObjectId, ref: "Acord" }],
    convocatoria: { type: Schema.ObjectId, ref: "Convocatoria" }
  });
  
  ActaSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Acta", ActaSchema);