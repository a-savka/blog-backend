
var MongoClient = require('./promisified_mongodb.js').MongoClient;
var dbConnection = null;

module.exports = {

  connect: function(connectionString, callback) {
    if(dbConnection == null) {
      return MongoClient.connect(connectionString, function (err, db) {
        if(err) {
          return callback(err);
        }
        dbConnection = db;
        callback(null, db);
      });
    }
    return process.nextTick(function() {
      return callback(null, dbConnection);
    });
  },

  getConnection: function() {
    return dbConnection;
  }

};