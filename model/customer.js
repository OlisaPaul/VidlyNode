const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validate(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(9).max(15).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

module.exports.validate = validate;
module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
