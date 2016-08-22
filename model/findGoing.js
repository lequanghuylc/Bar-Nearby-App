var connect = require('./dbConfig');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(val, callback){
    connect(function(db){
        var foo = db.collection("venue");
        foo.find({_id: ObjectId(val)}).toArray(function(err, docs){
            if(err){throw err}
            callback(docs);
            db.close();
        });
    });
}