var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var AcordSchema = new Schema({
    dataInici: { type: Date, required: true },
    dataFinal: { type: Date, required: true },
    acta: { type: Schema.ObjectId, ref: "Acta" }
  });
  
  AcordSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Acord", AcordSchema);