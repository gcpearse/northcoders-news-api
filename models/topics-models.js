const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query(`
  SELECT 
    topics.slug, 
    topics.description, 
    COUNT(articles.topic)::INT
    AS article_count
  FROM topics
  LEFT OUTER JOIN articles
  ON topics.slug = articles.topic
  GROUP BY topics.slug;
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

exports.insertTopic = ({ slug, description }) => {
  return db.query(`
  INSERT INTO topics
    (slug, description)
  VALUES
    ($1, $2)
  RETURNING *;
  `, [slug, description])
    .then(({ rows }) => {
      return rows[0];
    });
};
