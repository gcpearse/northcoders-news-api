const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db.query(`
  SELECT articles.article_id, articles.title, articles.topic,  articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT
  AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
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

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "No comments found"
        })
      }
      return rows;
    });
};
