require("winston-mongodb");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

module.exports = logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.File({ filename: "error.log" }),
    new transports.Console(),
    new transports.MongoDB({ db: "mongodb://localhost/vidly", level: "info" }),
  ],
});
