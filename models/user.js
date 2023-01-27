var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var crypto = require('crypto');

var UserSchema = new Schema({ 
  // Atributos Proyecto Ramón
  /*
  fullname: { type: String, required: true },
  role: [{
    type: String,
    enum: [
      "member","librarian","lender","administrator"     
    ],
    default: "member"
  }],
  */
  // Atributos de nuestro proyecto
  email: { type: String, required: true },
  password: { type: String, required: true },  
  nom: { type: String, required: true },
  cognom: { type: String, required: true },
  dni: { type: String, required: true },
  especialitat: { type: String, required: true },
  grup: [{ type: Schema.ObjectId, ref: "Grup" }],
  rol: [{ type: Schema.ObjectId, ref: "Rol" }]
});



// Export model
module.exports = mongoose.model('User', UserSchema);

