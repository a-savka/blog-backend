var db = require("../../libs/mongoconnection.js");
var Promise = require("bluebird");
var _ = require('lodash');


function _getCollection() {
  return db.getConnection().collection("blogs");
}


function _getAll(key) {
  return _getCollection().find({key: key}, {title: 1, categories: 1}).toArrayAsync();
}


function _get(id, key) {
  return _getCollection().find({_id: parseInt(id), key: key}).next();
}


function _insert(blog) {
  
  var collection = _getCollection();
  var cursor = collection.find({}, {_id: 1}).sort({_id: -1}).limit(1);

  return cursor.hasNext()
    .then(function(res) {
      if(!res) return Promise.resolve(1);
      return cursor.next().then(function(res) {
        var nextId = parseInt(res._id) + 1;
        if(isNaN(nextId)) {
          return Promise.reject(new Error("Database collection has records with non-numeric _id."));
        }
        return Promise.resolve(nextId);
      })
    })
    .then(function(nextId){
      blog._id = nextId;
      return collection.insertOne(blog).then(function(res) {
        return Promise.resolve(blog);
      });
    })
    .catch(function(err) {
      if(err.code == 11000) {
        return _insert(blog);
      }
      return Promise.reject(err);
    });

}

function _delete(id, key) {
  return _getCollection().deleteOne({_id: parseInt(id), key: key});
}


function _create(data, key) {

  var mockup = {
    title: "",
    categoreis: "",
    content: ""
  };

  return _.pick(_.assign(mockup ,data, {key: key}), ["title", "categories", "content", "key"])

}


function _validate(blog) {
  if(blog.title === "") return false;
  if(blog.content === "") return false;
  return true;
}


module.exports = {
  getAll: _getAll,
  get: _get,
  create: _create,
  validate: _validate,
  insert: _insert,
  delete: _delete
};