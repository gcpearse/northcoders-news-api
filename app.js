const express = require("express");
const { handleNotFound, getEndpoints } = require("./controllers/general-controllers");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./errors");

const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");
const topicsRouter = require("./routes/topics-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);

app.use(handlePsqlErrors, handleCustomErrors, handleServerErrors);

app.all("*", handleNotFound);

module.exports = app;
