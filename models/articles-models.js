const db = require("../db/connection");
const { getValidTopics } = require("./topics-models");

exports.selectAllArticles = async (topic) => {
  const validTopics = await getValidTopics();
  let queryString = `
  SELECT 
    articles.article_id, 
    articles.title, 
    articles.topic,  
    articles.author, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.comment_id)::INT
    AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  `;

  if (topic) {
    if (!validTopics.includes(topic)) {
      return Promise.reject({
        status: 404,
        message: "Your search did not match any results"
      });
    } else {
      queryString += `WHERE topic = '${topic}'`;
    }
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `;

  return db.query(`
  ${queryString}
  `)
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db.query(`
  SELECT * FROM articles
  WHERE article_id = $1
  `, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Article not found"
        });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db.query(`
  SELECT * FROM articles
  WHERE article_id = $1
  `, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Article not found"
        });
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db.query(`
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `, [article_id, inc_votes])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Article not found"
        });
      }
      return rows[0];
    });
};
