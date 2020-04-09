const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/myaccount", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/", [auth, admin], async function (req, res) {
  const user = await User.find().select("-password");
  res.send(user);
});

router.get("/:id", [auth, admin], async function (req, res) {
  var user = await User.findById(req.params.id).select("-password");
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/myaccount", auth, async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    var user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, password: password },
      {
        new: true,
      }
    );
  } else {
    var user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name },
      {
        new: true,
      }
    );
  }
  res.send(user);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      taux_remise: req.body.taux_remise,
      isAdmin: req.body.isAdmin,
    },
    {
      new: true,
    }
  );
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

router.delete("/myaccount", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.user._id);
  if (!user)
    return res
      .status(404)
      .send("The user with the given ID was already been deleted");
  res.send(user);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

module.exports = router;
