const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { handleNotFound } = require("./controllers/general-controllers");
const app = express();

app.get("/api/topics", getTopics);

app.all("*", handleNotFound);

module.exports = app;
