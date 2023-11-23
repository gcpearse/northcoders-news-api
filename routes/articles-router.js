const { getArticles, getArticleById, patchArticleById, postArticle } = require("../controllers/articles-controllers");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("")
  .get(getArticles)
  .post(postArticle);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
