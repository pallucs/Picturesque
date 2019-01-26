var express = require("express");
var router  = express.Router({mergeParams: true});
var Picture = require("../models/picture");
var Comment = require("../models/comment");
const ejsLint = require('ejs-lint');
var middleware = require("../middleware");

// comments new
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find picture by id
    Picture.findById(req.params.id, function(err, picture){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {picture: picture});
        }
    })
});

//comments create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup pictures using ID
   Picture.findById(req.params.id, function(err, picture){
       if(err){
           console.log(err);
           res.redirect("/pictures");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               picture.comments.push(comment);
               picture.save();
               console.log(comment);
               req.flash('success', "comment added successfully");
               res.redirect('/pictures/' + picture._id);
           }
        });
       }
   });
});


//comments edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
 Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {picture_id: req.params.id, comment: foundComment});
      }
   }); 
});

// COMMENT UPDATE
router.put("/:comment_id", function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/pictures/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", " comment deleted successfully");
           res.redirect("/pictures/" + req.params.id);
       }
    });
});




module.exports = router;