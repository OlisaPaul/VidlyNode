const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: { type: Number, default: 0, min: 0, max: 255 },
  dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 },
});

const Movie = mongoose.model("Movie", movieSchema);

function validate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreID: Joi.objectId().required(),
    numberInStock: Joi.number().min(5).max(255).required(),
    dailyRentalRate: Joi.number().min(5).max(255).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validate;
exports.movieSchema = movieSchema;
