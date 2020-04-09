const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
var { Article, validate } = require("../models/article");
const { Genre } = require("../models/genre");
var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  console.log(Article);
  var article = await Article.find();
  res.send(article);
});

router.get("/:id", async (req, res) => {
  var article = await Article.findById(req.params.id);
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let article = new Article({
    name: req.body.name,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    prix_ht: req.body.prix_ht,
    stockQty: req.body.stockQty,
    taxe: req.body.taxe,
    depot: req.body.depot,
  });
  article = await article.save();
  res.send(article);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      prix_ht: req.body.prix_ht,
      stockQty: req.body.stockQty,
      taxe: req.body.taxe,
      depot: req.body.depot,
    },
    {
      new: true,
    }
  );
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const article = await Article.findByIdAndRemove(req.params.id);
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});
module.exports = router;
