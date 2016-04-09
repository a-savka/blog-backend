var express = require('express');
var router = express.Router();
var log = require("../../libs/log")(module);
var blogs = require("../../my_modules/services/blogs");

router.use(function(req, res, next) {
  if(!req.query.key) {
    return res.status(400).send("Bad Request");
  }
  next();
});


router.get("/", function(req, res, next) {
  blogs.getAll(req.query.key).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    log.error(err);
    res.status(500).send("Server side error");
  });
});


router.get('/:id', function(req, res, next) {
  blogs.get(req.params.id, req.query.key).then(function(doc) {
    if(doc) {
      return res.json(doc);
    }
    return res.status(404).send("Not found");
  }).catch(function(err) {
    log.error(err);
    res.status(500).send("Server side error");
  });;
});


router.post('/', function(req, res, next) {

  var newBlog = blogs.create(req.body, req.query.key);
  if(!blogs.validate(newBlog)) {
    return res.status(400).send("Bad request");
  }

  blogs.insert(newBlog).then(function(blog) {
    res.json(blog);
  }).catch(function(err) {
    log.error(err);
    res.status(500).send("Server side error");
  });

});


router.delete('/:id', function(req, res, next) {
  blogs.get(req.params.id, req.query.key).then(function(doc) {
    if(doc) {
      return blogs.delete(req.params.id, req.query.key).then(function() {
        res.json(doc);
      });
    }
    return res.status(404).send("Not Found");
  }).catch(function(err) {
    log.error(err);
    res.status(500).send("Server side error");
  });
});


module.exports = router;