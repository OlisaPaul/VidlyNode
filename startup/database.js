const logger = require("../logger/logger");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => logger.info("Connected to MongoDB..."));
};
