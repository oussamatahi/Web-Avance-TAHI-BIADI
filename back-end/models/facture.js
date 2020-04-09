const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const factureSchema = new Schema({
  dateOn: { type: Date, default: Date.now },
  commande: { type: Schema.Types.ObjectId, required: true, ref: "Commande" },
  client: { type: String, minlength: 5, maxlength: 100 },
  prixtotale: { type: Number, min: 0.0 },
  prixtotale_ht: { type: Number, min: 0.0 },
  prixtotale_final: { type: Number, min: 0.0 },
  lieudelivraison: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
});

const Facture = mongoose.model("Facture", factureSchema);

function validateFature(req) {
  const schema = {
    dateOn: Joi.date().default(Date.now()),
    client: Joi.string().min(5).max(100),
    lieudelivraison: Joi.string().min(5).max(100).required(),
    prixtotale: Joi.number().min(0),
    prixtotale_final: Joi.number().min(0),
    prixtotale_ht: Joi.number().min(0),
    commande: Joi.required(),
  };

  return Joi.validate(req, schema);
}

exports.validate = validateFature;
module.exports.Facture = Facture;
