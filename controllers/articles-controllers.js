const { selectArticleById, selectAllArticles, updateArticleById } = require("../models/articles-models");

const validQueries = ["topic"]

exports.getAllArticles = (req, res, next) => {
  const query = Object.keys(req.query)[0]
  const { topic } = req.query
  if (query && !validQueries.includes(query)) {
    res.status(404).send({ message: "Your search did not match any results" })
  } else {
    selectAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
  }
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
