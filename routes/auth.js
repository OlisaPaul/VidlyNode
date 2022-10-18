const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("Joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../model/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

router.get("/", async (req, res) => {
  const user = await User.find();

  res.send(user);
});

function validate(req) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(1024).required(),
    email: Joi.string().email().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
