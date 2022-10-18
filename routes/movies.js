const auth = require("../middleware/auth");
const { Movie, validate } = require("../model/movie");
const { Genre } = require("../model/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreID);
  if (!genre)
    return res.status(404).send(`We could not find genre with the provided iD`);

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const genre = await Genre.findById(req.body.genreID);
  if (!genre)
    return res.status(404).send(`We could not find genre with the provided iD`);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock,
      },
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send(`We could not find genre with the provided iD`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await movie.save();
  res.send(result);
});

module.exports = router;
