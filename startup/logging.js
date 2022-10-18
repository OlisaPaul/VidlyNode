require("express-async-errors");
const logger = require("../logger/logger");
const { transports } = require("winston");

module.exports = function () {
  logger.exceptions.handle(
    new transports.File({ filename: "exceptions.log" }),
    new transports.Console()
  );
};
