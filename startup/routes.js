const express = require("express");
const movies = require("../routes/movies");
const customers = require("../routes/customers");
const auth = require("../routes/auth");
const genres = require("../routes/genres");
const users = require("../routes/users");
const rentals = require("../routes/rentals");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/genres", genres);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
