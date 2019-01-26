var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
const ejsLint = require('ejs-lint');


router.get("/", function(req,res){
    res.render("landing");
});


// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to Picturesque " + user.username);
           res.redirect("/pictures"); 
        });
    });
});


// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/pictures",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "logged you out");
   res.redirect("/pictures");
});



module.exports = router;