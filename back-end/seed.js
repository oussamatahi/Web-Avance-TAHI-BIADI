const { Genre } = require("./models/genre");
const { User } = require("./models/user");
const { Article } = require("./models/article");
const { Facture } = require("./models/facture");
const { Commande } = require("./models/commande");

const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Electro",
    articles: [
      {
        name: "HP Omen",
        stockQty: 50,
        taxe: 0.2,
        prix_ht: 999,
        depot: "Paris",
      },
      {
        name: "Samsung Galaxy",
        stockQty: 100,
        taxe: 0.4,
        prix_ht: 700,
        depot: "Bourges",
      },
      {
        name: "Play Station",
        stockQty: 30,
        taxe: 0.3,
        prix_ht: 500,
        depot: "Lyon",
      },
    ],
  },
  {
    name: "Fruit",
    articles: [
      {
        name: "Oranges",
        stockQty: 200,
        taxe: 0.2,
        prix_ht: 5,
        depot: "Bourges",
      },
      {
        _id: "5e8de31f70259d1c70d8f2fc",
        name: "Banane",
        stockQty: 100,
        taxe: 0.1,
        prix_ht: 3,
        depot: "Bourges",
      },
      {
        _id: "5e8de31f70259d1c70d8f2fe",
        name: "Ananas",
        stockQty: 150,
        taxe: 0.2,
        prix_ht: 6,
        depot: "Bourges",
      },
    ],
  },
  {
    name: "Legumes",
    articles: [
      {
        name: "Tomate",
        stockQty: 50,
        taxe: 0.2,
        prix_ht: 3,
        depot: "Centre Bourges",
      },
      {
        name: "Onion",
        stockQty: 30,
        taxe: 0.2,
        prix_ht: 1.5,
        depot: "Centre Bourges",
      },
      {
        name: "Pommes de terre",
        stockQty: 20,
        taxe: 0.1,
        prix_ht: 2,
        depot: "Centre Bourges",
      },
    ],
  },
  {
    name: "Movies",
    articles: [
      {
        name: "The Sixth Sense",
        stockQty: 5,
        taxe: 0.2,
        prix_ht: 10,
        depot: "Rabat",
      },
      {
        _id: "5e8de32070259d1c70d8f30a",
        name: "Gone Girl",
        stockQty: 10,
        taxe: 0.2,
        prix_ht: 15,
        depot: "Rabat",
      },
      {
        name: "The Others",
        stockQty: 15,
        taxe: 0.2,
        prix_ht: 20,
        depot: "Rabat",
      },
    ],
  },
  {
    name: "Books",
    articles: [
      {
        name: "Harry Potter",
        stockQty: 5,
        taxe: 0.5,
        prix_ht: 18,
        depot: "Paris",
      },
      {
        _id: "5e8de32070259d1c70d8f311",
        name: "Game of Thrones",
        stockQty: 10,
        taxe: 0.2,
        prix_ht: 17,
        depot: "Paris",
      },
      {
        _id: "5e8de32070259d1c70d8f313",
        name: "DragonBall",
        stockQty: 15,
        taxe: 0.6,
        prix_ht: 16,
        depot: "Paris",
      },
    ],
  },
];

const userdata = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: "$2b$10$5pRKYYQrp96dkef8/uFu/.izpU.8f1QhKFwGStQdI5iJKaC/FYMMy",
    taux_remise: 1,
    isAdmin: true,
  },
  {
    _id: "5e8deb0dc07c960464c46777",
    taux_remise: "0",
    isAdmin: false,
    name: "Oussama",
    email: "oussama@tahi.com",
    password: "$2b$10$SyxepLRmQ3lrHvlvpOuzoOcCmrubPQUTt700rmrFh5VtAJ/KerRLy",
    __v: "0",
  },
];

const commandedata = {
  _id: "5e8deca6c07c960464c4684a",
  isPayed: true,
  client: "5e8deb0dc07c960464c46777",
  detailDuCommande: [
    {
      _id: "5e8deca6c07c960464c4684b",
      article: "5e8de32070259d1c70d8f30a",
      qty: "3",
    },
    {
      _id: "5e8deca6c07c960464c4684c",
      article: "5e8de32070259d1c70d8f311",
      qty: "1",
    },
    {
      _id: "5e8deca6c07c960464c4684d",
      article: "5e8de32070259d1c70d8f313",
      qty: "3",
    },
    {
      _id: "5e8deca6c07c960464c4684e",
      article: "5e8de31f70259d1c70d8f2fc",
      qty: "1",
    },
    {
      _id: "5e8deca6c07c960464c4684f",
      article: "5e8de31f70259d1c70d8f2fe",
      qty: "4",
    },
  ],
  dateOn: "1586359462069",
};

const facturedata = {
  _id: "5e8deca9c07c960464c46861",
  commande: "5e8deca6c07c960464c4684a",
  client: "oussama@tahi.com",
  prixtotale: "183.30000000000004",
  prixtotale_final: "183.30000000000004",
  prixtotale_ht: "137",
  lieudelivraison: "88 Boulevard Lahitolle, 18000 Bourges",
  dateOn: "1586359465912",
};

async function seed() {
  await mongoose.connect(config.get("db"));

  await Article.deleteMany({});
  await Genre.deleteMany({});
  await User.deleteMany({});
  await Commande.deleteMany({});
  await Facture.deleteMany({});

  await User.insertMany(userdata);
  await Commande.insertMany(commandedata);
  await Facture.insertMany(facturedata);

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const articles = genre.articles.map((article) => ({
      ...article,
      genre: { _id: genreId, name: genre.name },
    }));
    await Article.insertMany(articles);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
