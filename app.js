const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { handleNotFound, getEndpoints } = require("./controllers/general-controllers");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.all("*", handleNotFound);

module.exports = app;
