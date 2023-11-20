const endpoints = require("../endpoints.json");

exports.selectAllEndpoints = () => {
  return Promise.resolve(endpoints);
};
