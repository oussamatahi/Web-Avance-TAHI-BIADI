const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 100 },
  genre: { type: genreSchema, required: true },
  prix_ht: { type: Number, required: true, min: 0 },
  stockQty: { type: Number, required: true, min: 0 },
  taxe: { type: Number, required: true, max: 1, min: 0 },
  depot: { type: String, required: true },
});

const Article = mongoose.model("Article", articleSchema);

function validateArticle(article) {
  const schema = {
    name: Joi.string().min(5).max(100).required(),
    genreId: Joi.objectId().required(),
    prix_ht: Joi.number().min(0).required(),
    taxe: Joi.number().required().min(0).max(1),
    stockQty: Joi.number().min(0).required(),
    depot: Joi.string().required(),
  };

  return Joi.validate(article, schema);
}

exports.validate = validateArticle;
module.exports.Article = Article;
