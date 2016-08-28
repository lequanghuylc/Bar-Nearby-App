var connect = require('./dbConfig');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(find, update, callback){
    connect(function(db){
        var foo = db.collection("venue");
        foo.update(find, update, function(err, docs){
            if(err){throw err;}
            callback(docs);
            db.close();
        });
    });
}