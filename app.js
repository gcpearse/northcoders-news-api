const express = require("express");
const { getArticleById, getAllArticles } = require("./controllers/articles-controllers");
const { handleNotFound, getEndpoints } = require("./controllers/general-controllers");
const { getTopics } = require("./controllers/topics-controllers");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors");
const { getCommentsByArticleId, postCommentByArticleId } = require("./controllers/comments-controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/topics", getTopics);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("*", handleNotFound);

module.exports = app;
