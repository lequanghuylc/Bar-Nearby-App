var connect = require('./dbConfig');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(val, callback){
    connect(function(db){
        var foo = db.collection("venue");
        foo.insert(val, function(err, record){
            if(err){throw err}
            callback(record.ops[0]);
            db.close();
        });
    });
}