var connect = require('./dbConfig');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(val, callback){
    connect(function(db){
        var foo = db.collection("venue");
        foo.find({_id: val}).toArray(function(err, docs){
            if(err){throw err}
            callback(docs);
            db.close();
        });
    });
}