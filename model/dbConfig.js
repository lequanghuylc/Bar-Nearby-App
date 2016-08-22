var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://'+process.env.IP+':27017/barnearby';

module.exports = function(main){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        main(db);
    });
}