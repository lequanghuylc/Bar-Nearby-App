var express = require('express');
var app = express();
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require("body-parser");


// require model
var cookie = require("./model/cookie");
var findUser = require("./model/findUser");
var addUser = require("./model/addUser");
var findGoing = require("./model/findGoing");

//serve static file, don't need to use view engine because of react
app.use(express.static(__dirname + '/views'));

// handle post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get request 
app.get('/checklogin', function(req,res){
    //console.log(JSON.stringify(cookie(req)));
    if(!cookie(req).user){
        res.end("false");
    } else {
        var validateCookie = {
            "_id":  ObjectId(cookie(req).au),
            "user": cookie(req).user
        };
        findUser(validateCookie, function(err, docs){
            if(err){throw err;}
            if(docs.length >0){res.end(cookie(req).user);}
            else {res.end("false");}
        });
    }
 
app.get('/getgoing/*', function(req,res){
  var id = req.url.substring(10);
  findGoing(id, function(docs){
      res.send(docs);
  });
}),  
// post request
app.post("/login",function(req,res){
    findUser({"user" : req.body.user}, function(err, docs){
        if(err){throw err;}
        if(docs.length >0){
            if(docs[0].pass === req.body.pass){
                res.send({
                    accept: true,
                    cookie: docs[0]._id
                });
            } else {
                res.send({
                    accept: false,
                    cookie: null
                });
            }
        } else {
            addUser(req.body, function(id){
                res.send({
                    accept: true,
                    cookie: id
                });
            });
        }
    })
    console.log(JSON.stringify(req.body));
});
    
});
app.listen(8080);