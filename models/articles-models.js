const db = require("../db/connection");
const format = require("pg-format");
const { getValidTopics } = require("./topics-models");

exports.selectAllArticles = async (topic, sort_by = "created_at", order = "desc") => {
  const validTopics = await getValidTopics();
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url"
  ];
  const validOrder = ["asc", "desc"];
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
      queryString += format(`WHERE topic = %L`, topic);
    }
  }

  if (sort_by) {
    if (!validSortBy.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        message: "Bad request"
      });
    }
  }

  if (order) {
    if (!validOrder.includes(order)) {
      return Promise.reject({
        status: 400,
        message: "Bad request"
      });
    }
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};
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
  SELECT
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id)::INT
    AS comment_count
  FROM articles 
  LEFT OUTER JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
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
