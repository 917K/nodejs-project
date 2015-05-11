var news = require('express').Router();

news.getAll = function(req, res, next) {
  res.send('getAll');
};

news.getById = function(req, res, next) {
  res.send('getById');
};

module.exports = news;