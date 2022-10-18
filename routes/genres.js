const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Genre, validate } = require("../model/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  const result = await genre.save();
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send(`We could not find genre with the provided iD`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;

  const result = await genre.save();
  res.send(result);
});

module.exports = router;
