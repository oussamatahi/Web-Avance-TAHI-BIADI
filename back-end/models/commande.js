const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Article",
  },
  qty: { type: Number, min: 1, required: true },
});

const commandeSchema = new Schema({
  dateOn: { type: Date, default: Date.now },
  client: { type: Schema.Types.ObjectId, ref: "User" },
  detailDuCommande: [detailSchema],
  isPayed: { type: Boolean, default: false },
});

const Commande = mongoose.model("Commande", commandeSchema);

function validateCommande(req) {
  const schema = {
    dateOn: Joi.date().default(Date.now()),
    isPayed: Joi.boolean().default(false),
    detailDuCommande: Joi.array()
      .items(
        Joi.object({
          article: Joi.required(),
          qty: Joi.number().min(1).required(),
        })
      )
      .required(),
  };

  return Joi.validate(req, schema);
}

exports.validate = validateCommande;
module.exports.Commande = Commande;
