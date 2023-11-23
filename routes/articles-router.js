const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles-controllers");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
