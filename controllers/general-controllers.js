const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints);
};

exports.handleNotFound = (req, res, next) => {
  res.status(404).send({ message: "Path not found" })
    .catch(next);
};
