// PACKAGE SET UP

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    methodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");

// ROUTES SET UP    
var indexRoutes     = require("./routes/index"),
    commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds");
    
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://karl:April22013@ds227119.mlab.com:27119/yelp_camp");
app.use(bodyParser.urlencoded({ extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require("moment");
app.use(require("express-session")({
    secret: "I am having problems choosing this string",
    resave: false,
    saveUninitialized: false
}));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTES
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);
    

// LISTENER

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server now hosting");
});