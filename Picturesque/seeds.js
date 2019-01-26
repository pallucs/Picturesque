var mongoose = require("mongoose");
var Picture = require("./models/picture");
var Comment   = require("./models/comment");

var data = [
    {
        title: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    
    {
        title: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
]

function seedDB(){
   //Remove all pictures
   Picture.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed pictures!");
         //add a few pictures
        data.forEach(function(seed){
            Picture.create(seed, function(err, picture){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a picture");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                picture.comments.push(comment);
                                picture.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
