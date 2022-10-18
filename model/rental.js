const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 255 },
      isGold: { type: Boolean, required: true },
      phone: { type: String, required: true, minlength: 5, maxlength: 255 },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: { type: String, required: true, minlength: 5, maxlength: 255 },
      dailyRentalRate: { type: String, required: true, min: 5, max: 255 },
    }),
    required: true,
  },
  dateOut: { type: Date, default: Date.now, required: true },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validate(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validate;
