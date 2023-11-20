const { selectAllEndpoints } = require("../models/general-models");

exports.getEndpoints = (req, res, next) => {
  selectAllEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch(next);
};

exports.handleNotFound = (req, res, next) => {
  res.status(404).send({ message: "Path not found" })
    .catch(next);
};
