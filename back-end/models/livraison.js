const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;


const livraisonSchema = new Schema({
 dateOn: {type: Date, default: Date.now},
 facture: [{type:Schema.Types.ObjectId,required:true, ref:"Facture"}]
});

const  Livraison = mongoose.model('Livraison', livraisonSchema);

function validateLivraison(req) {
    const schema = {
      dateOn: Joi.date().default(Date.now()),
      facture: Joi.required()
    };
  
    return Joi.validate(req, schema);
  }

exports.validate = validateLivraison;
module.exports.Livraison = Livraison;