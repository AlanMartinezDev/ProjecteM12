var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var ConvocatoriaSchema = new Schema({
    data: { type: Date, required: true },
    horaInici: { type: Time, required: true },
    durada: { type: Integer, required: true },
    lloc: { type: String, required: true },
    puntsOrdreDia: [{ type: String, required: true }],
    convocats: [{ type: Schema.ObjectId, ref: "User" }],
    plantilla: { type: Schema.ObjectId, ref: "Plantilla" },
    responsable: { type: Schema.ObjectId, ref: "Responsable" }
  });
  
  ConvocatoriaSchema.plugin(mongoosePaginate);
  // Export model.
  module.exports = mongoose.model("Convocatoria", ConvocatoriaSchema);