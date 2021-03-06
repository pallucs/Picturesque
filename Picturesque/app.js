var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    flash       = require("connect-flash"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Picture     = require("./models/picture"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    ejsLint     = require('ejs-lint')
    
    //requring routes
var commentRoutes    = require("./routes/comments"),
    pictureRoutes = require("./routes/pictures"),
    indexRoutes      = require("./routes/index")


mongoose.connect("mongodb://localhost/Picture", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//
// seedDB();  // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:" titoo is cutest",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/pictures", pictureRoutes);
app.use("/pictures/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Picturesque Server Has Started"); 
});