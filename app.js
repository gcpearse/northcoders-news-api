const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { handleNotFound, getEndpoints } = require("./controllers/general-controllers");
const { getArticleById } = require("./controllers/articles-controllers");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/topics", getTopics);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("*", handleNotFound);

module.exports = app;
