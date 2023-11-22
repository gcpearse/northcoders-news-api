const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query(`
  SELECT * FROM topics;
  `)
    .then(({ rows }) => {
      return rows;
    });
};

exports.getValidTopics = () => {
  return db.query(`
  SELECT slug FROM topics;
  `)
    .then(({ rows }) => {
      return rows.map((row) => row.slug);
    });
};
