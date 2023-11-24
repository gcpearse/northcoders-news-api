const db = require("../db/connection");
const { checkArticleExists } = require("./articles-models");

exports.selectCommentsByArticleId = async (article_id, { limit = 10, p }) => {
  const existingArticle = await checkArticleExists(article_id);

  if (article_id) {
    if (isNaN(+article_id) || +article_id < 0) {
      return Promise.reject({
        status: 400,
        message: "Bad request"
      });
    }
  }

  if (limit) {
    if (isNaN(+limit) || +limit < 0) {
      return Promise.reject({
        status: 400,
        message: "Bad request"
      });
    }
  }

  let queryString = `
  SELECT * FROM comments
  WHERE article_id = ${article_id}
  ORDER BY created_at DESC
  LIMIT ${limit}
  `;

  if (p) {
    if (isNaN(+p) || +p < 1) {
      return Promise.reject({
        status: 400,
        message: "Bad request"
      });
    } else {
      queryString += `
      OFFSET ${(+p - 1) * +limit};
      `;
    }
  }

  return db.query(`
  ${queryString}
  `)
    .then(({ rows }) => {
      if (p && !rows.length) {
        return Promise.reject({
          status: 404,
          message: "Page not found"
        });
      }
      return Promise.all([rows, existingArticle]);
    });
};

exports.insertCommentByArticleId = ({ username, body }, article_id) => {
  return db.query(`
    INSERT INTO comments
      (author, body, article_id)
    VALUES
      ($1, $2, $3)
    RETURNING *;
    `, [username, body, article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return db.query(`
  UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *;
  `, [comment_id, inc_votes])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Comment not found"
        });
      }
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query(`
  DELETE FROM comments
  WHERE comment_id = $1
  `, [comment_id])
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject({
          status: 404,
          message: "Comment not found"
        });
      }
    });
};
