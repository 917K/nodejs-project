var news = require('express').Router();

news.get('/news', function(req, res) {
  res.send('news'); // load the index.ejs file
});

module.exports = news;