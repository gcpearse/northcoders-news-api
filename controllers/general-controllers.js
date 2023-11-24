const endpoints = require("../endpoints.json");

exports.getEndpoints = async (req, res, next) => {
  try {
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
};

exports.handleNotFound = (req, res, next) => {
  try {
    res.status(404).send({ message: "Path not found" });
  } catch (err) {
    next(err);
  }
};
