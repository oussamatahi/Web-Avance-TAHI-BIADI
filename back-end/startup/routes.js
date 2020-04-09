const express = require("express");

const indexRouter = require("../routes/index");
const usersRouter = require("../routes/users");
const genresRouter = require("../routes/genres");
const articleRouter = require("../routes/articles");
const commandeRouter = require("../routes/commandes");
const factureRouter = require("../routes/factures");
const livraisonRouter = require("../routes/livraisons");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/genres", genresRouter);
  app.use("/articles", articleRouter);
  app.use("/commandes", commandeRouter);
  app.use("/livraisons", livraisonRouter);
  app.use("/factures", factureRouter);
  app.use("/auth", auth);
  app.use(error);
};
