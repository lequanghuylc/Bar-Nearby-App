var express = require('express');
var app = express();
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require("body-parser");


// require model
var cookie = require("./model/cookie");
var findUser = require("./model/findUser");
var addUser = require("./model/addUser");
var updateUser = require("./model/updateUser");
var findGoing = require("./model/findGoing");
var addGoing = require("./model/addGoing");
var updateGoing = require("./model/updateGoing");

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
});

app.get('/getgoing/*', function(req,res){
  var id = req.url.substring(10);
  findGoing(id, function(docs){
      res.send(docs);
  });
}), 

app.get("/gettoggle/*", function(req,res){
   var arr = req.url.split("/");
   var user = arr[2];
   var venueID = arr[3];
   findUser({"user":user}, function(err,docs){
      if(err){throw err;}
      if(docs[0].venue === undefined){res.send({toggle: false});}
      else {
          var venueArr = JSON.stringify(docs[0].venue);
          if(venueArr.indexOf(venueID) === -1){res.send({toggle: false});}
          else{res.send({toggle: true});}
      }
   });
});
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
    
app.post("/addgoing/", function(req,res){
    findGoing(req.body._id, function(docs){
        if(docs.length === 0){
            addGoing(req.body, function(docs2){
             updateGoing(req.body,{
                 $set: {going: 1}
             },function(docs3) {
                 res.send("ok");
             });  
           }); 
        } else {
            updateGoing(req.body,{
                $inc:{going: 1}
            }, function(docs4){
                res.send("ok");
            });
        }
        
    });
});

app.post("/updategoing/", function(req,res){
    updateGoing({
        "_id": req.body._id
    },{
        $inc:{going: Number(req.body.going)}
    }, function(docs){
        res.send("ok");
    });
});

app.post("/usertogglegoing/", function(req,res){
   findUser({"user" : req.body.user}, function(err, docs){
       if(err){throw err;}
       if(docs[0].venue === undefined){
          var venueArr = [req.body.id]; 
       } else {
           var venueArr = JSON.parse(docs[0].venue);
           if(venueArr.indexOf(req.body.id) === -1){venueArr.push(req.body.id);}
           // remove venue id from arr
           else {venueArr = venueArr.slice(0, venueArr.indexOf(req.body.id)).concat(venueArr.slice(venueArr.indexOf(req.body.id)+1, venueArr.length));}
       }
       updateUser({"user" : req.body.user}, {$set: {
           "venue": JSON.stringify(venueArr)
       }}, function(docs){
           res.send("ok");
       });
   }); 
});

var port = process.env.PORT || 8080;
app.listen(port);