var express = require('express');
var router = express.Router();
var posts = require('./api/posts.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use('/api/posts', posts);

module.exports = router;
