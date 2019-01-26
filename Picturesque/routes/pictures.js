var express = require("express");
var router  = express.Router();
var Picture = require("../models/picture");
const ejsLint = require('ejs-lint');
var middleware = require("../middleware");

//INDEX - show all pictures
router.get("/", function(req, res){
    // Get all pictures from DB 
    Picture.find({}, function(err, allPictures){
       if(err){
           console.log(err);
       } else {
          res.render("pictures/pictures",{pictures:allPictures});
       }
    });
});


//CREATE - add new picture to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.title;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPicture = {title: name, price: price, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Picture.create(newPicture, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/pictures");
        }
    });
});

//NEW - show form to create new pictures
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("pictures/new"); 
});

// SHOW - shows more info about one picture
router.get("/:id", function(req, res){
    //find the picture with provided ID
    Picture.findById(req.params.id).populate("comments").exec(function(err, foundPicture){
        if(err){
            console.log(err);
        } else {
            console.log(foundPicture);
            //render show template with that campground
            res.render("pictures/show", {picture: foundPicture});
        }
    });
});


// edit picture route

router.get("/:id/edit", middleware.checkPictureOwnership, function(req,res){
               Picture.findById(req.params.id, function(err, foundPicture){
               res.render("pictures/edit", {picture: foundPicture});
        });
    });

// update picture route

router.put("/:id",middleware.checkPictureOwnership, function(req,res){
   //find and update the correct picture
   
   Picture.findByIdAndUpdate(req.params.id,req.body.picture, function(err, updatedPicture){
      if(err){
          res.redirect("/pictures");
      } else {
          //redirect somewhere(show page)
          res.redirect("/pictures/" + req.params.id);
      }
   });
});
// destroy picture route

router.delete("/:id", middleware.checkPictureOwnership, function(req,res){
     Picture.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/pictures");
      } else {
          res.redirect("/pictures");
      }
   });
});



module.exports = router;