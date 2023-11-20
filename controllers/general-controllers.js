exports.handleNotFound = (req, res, next) => {
  res.status(404).send({ message: "Path not found" })
    .catch(next);
};
