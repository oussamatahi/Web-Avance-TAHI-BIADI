const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Commande, validate } = require("../models/commande");
const { Article } = require("../models/article");
const _ = require("lodash");
const Fawn = require("fawn");
var mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/mycommandes", auth, async (req, res) => {
  const commande = await Commande.find({ client: req.user._id })
    .populate(["commande"])
    .sort("-dateOn");
  res.send(commande);
});

router.get("/:id", auth, async (req, res) => {
  const commande = await Commande.findById(req.params.id).populate([
    "client",
    "commande",
  ]);
  if (!commande)
    return res
      .status(404)
      .send("The commande with the given ID was not found!");

  res.send(commande);
});
router.get("/", [auth, admin], async (req, res) => {
  const commande = await Commande.find()
    .populate(["client", "commande"])
    .sort("-dateOn");
  res.send(commande);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body.detailDuCommande.length === 0)
    return res.status(400).send("detailDuCommande not allowed to be empty");

  for (let index = 0; index < req.body.detailDuCommande.length; index++) {
    let article = await Article.findById(
      req.body.detailDuCommande[index].article
    );

    if (!article)
      return res
        .status(404)
        .send(
          `This article ${req.body.detailDuCommande[index].article} was not found!`
        );

    if (article.stockQty === 0)
      return res
        .status(404)
        .send(
          `This article ${req.body.detailDuCommande[index].article} is not in stock!`
        );

    if (article.stockQty < req.body.detailDuCommande[index].qty)
      return res
        .status(404)
        .send(
          `There is not enough quantity of this article ${req.body.detailDuCommande[index].article} in stock!`
        );
  }

  let commande = new Commande({
    client: req.user._id,
    detailDuCommande: req.body.detailDuCommande,
  });

  new Fawn.Task().save("commandes", commande).run();
  for (let index = 0; index < commande.detailDuCommande.length; index++) {
    new Fawn.Task()
      .update(
        "articles",
        { _id: commande.detailDuCommande[index].article },
        {
          $inc: { stockQty: -commande.detailDuCommande[index].qty },
        }
      )
      .run();
  }

  res.send(commande.populate("commande"));
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let commande = await Commande.findById(req.params.id);
  if (!commande)
    return res
      .status(404)
      .send("The commande with the given ID was not found!");
  if (commande.client != req.user._id)
    return res.status(403).send("Access denied 2.0");

  for (let index = 0; index < req.body.detailDuCommande.length; index++) {
    let article = await Article.findById(
      req.body.detailDuCommande[index].article
    );
    if (!article) return res.status(404).send("This article was not found!");

    if (article.stockQty + commande.detailDuCommande[index].qty === 0)
      return res
        .status(404)
        .send(
          `This article ${req.body.detailDuCommande[index].article} is not in stock!`
        );

    if (
      article.stockQty + commande.detailDuCommande[index].qty <
      req.body.detailDuCommande[index].qty
    )
      return res
        .status(404)
        .send(
          `There is not enough quantity of this article ${req.body.detailDuCommande[index].article} in stock!`
        );
  }

  for (let index = 0; index < commande.detailDuCommande.length; index++) {
    new Fawn.Task()
      .update(
        "articles",
        { _id: commande.detailDuCommande[index].article },
        {
          $inc: { stockQty: commande.detailDuCommande[index].qty },
        }
      )
      .run();
  }

  commande = await Commande.findByIdAndUpdate(
    req.params.id,
    {
      detailDuCommande: req.body.detailDuCommande,
    },
    {
      new: true,
    }
  );

  for (let index = 0; index < commande.detailDuCommande.length; index++) {
    new Fawn.Task()
      .update(
        "articles",
        { _id: commande.detailDuCommande[index].article },
        {
          $inc: { stockQty: -commande.detailDuCommande[index].qty },
        }
      )
      .run();
  }

  res.send(commande.populate("commande"));
});

router.delete("/:id", auth, async (req, res) => {
  const commande = await Commande.findByIdAndRemove(req.params.id);
  if (!commande)
    return res
      .status(404)
      .send("The commande with the given ID was not found!");

  for (let index = 0; index < commande.detailDuCommande.length; index++) {
    new Fawn.Task()
      .update(
        "articles",
        { _id: commande.detailDuCommande[index].article },
        {
          $inc: { stockQty: commande.detailDuCommande[index].qty },
        }
      )
      .run();
  }

  res.send(commande);
});

module.exports = router;
