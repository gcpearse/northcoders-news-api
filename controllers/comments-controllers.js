const { checkArticleExists } = require("../models/articles-models");
const { selectCommentsByArticleId, insertCommentByArticleId, removeCommentById } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentsPromises = [selectCommentsByArticleId(article_id)];
  if (article_id) {
    commentsPromises.push(checkArticleExists(article_id));
  }
  Promise.all(commentsPromises)
    .then((commentsPromises) => {
      const comments = commentsPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  insertCommentByArticleId(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
