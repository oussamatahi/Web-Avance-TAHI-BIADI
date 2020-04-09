const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Facture, validate } = require("../models/facture");
const { Commande } = require("../models/commande");
const { User } = require("../models/user");
const { Article } = require("../models/article");
const _ = require("lodash");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

router.get("/myfactures", auth, async (req, res) => {
  const facture = await Facture.find({ client: req.user.email }).populate(
    "commande"
  );

  res.send(facture);
});

router.get("/:id", auth, async (req, res) => {
  const facture = await Facture.findById(req.params.id).populate("commande");
  if (!facture)
    return res.status(404).send("The facture with the given ID was not found.");
  res.send(facture);
});

router.get("/", [auth, admin], async (req, res) => {
  const facture = await Facture.find().populate("commande").sort("-dateOn");
  res.send(facture);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let command = await Commande.findById(req.body.commande);
  if (!command)
    return res
      .status(404)
      .send(`This commande ${req.body.commande}  was not found!`);
  if (command.client != req.user._id)
    return res.status(403).send("Access denied 2.0");
  if (command.isPayed)
    return res.status(404).send("This command already been payed");

  let some_ht = 0;
  let some = 0;
  for (let index = 0; index < command.detailDuCommande.length; index++) {
    let article = await Article.findById(
      command.detailDuCommande[index].article
    );
    some_ht += article.prix_ht * command.detailDuCommande[index].qty;
    some +=
      (article.prix_ht + article.prix_ht * article.taxe) *
      command.detailDuCommande[index].qty;
  }
  var user = await User.findById(req.user._id);
  const remise = some - some * user.taux_remise;
  let facture = new Facture({
    commande: req.body.commande,
    client: user.email,
    prixtotale: some,
    prixtotale_final: remise,
    prixtotale_ht: some_ht,
    lieudelivraison: req.body.lieudelivraison,
  });

  new Fawn.Task()
    .save("factures", facture)
    .update(
      "commandes",
      { _id: command._id },
      {
        isPayed: true,
      }
    )
    .run();

  res.send(facture.populate("facture"));
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const facture = await Facture.findByIdAndRemove(req.params.id);

  if (!facture)
    return res.status(404).send("The facture with the given ID was not found.");

  res.send(facture);
});

module.exports = router;
