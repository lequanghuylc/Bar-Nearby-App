var connect = require('./dbConfig');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(val, callback){
    connect(function(db){
        var foo = db.collection("user");
        foo.find(val).toArray(function(err, docs){
            callback(err, docs);
            db.close();
        });
    });
}