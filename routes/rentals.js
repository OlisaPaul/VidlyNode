const auth = require("../middleware/auth");
const { Rental, validate } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init("mongodb://localhost/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental)
    return res.status(404).send(`We could not find genre with the provided iD`);

  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send(`We could not find customer with the provided ID`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send(`We could not find movie with the provided ID`);

  const rental = new Rental({
    dateReturned: req.body.dateReturned,
    rentalFee: req.body.rentalFee,
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (error) {
    res.status(500).send("Something Failed");
  }

  //const result = await rental.save();

  res.send(rental);
});

router.put("/:id", auth, async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send(`We could not find customer with the provided ID`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send(`We could not find movie with the provided ID`);

  let rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        amount: req.body.amount,
        date: req.body.date,
        customer: {
          _id: customer._id,
          name: customer.name,
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      },
    },
    { new: true }
  );

  if (!rental)
    return res.status(404).send(`We could not find genre with the provided iD`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  res.send(rental);
});

module.exports = router;
