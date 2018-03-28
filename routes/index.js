// SET UP

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// =======================
// INDEX ROUTES
// =======================

// ROOT - Home page
router.get("/", function(req, res){
    res.render("home");
});

// =======================
// AUTHENTICATION ROUTES
// =======================

// REGISTER
router.get("/register", function(req, res){
    res.render("register", { page: "register" });
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully registered! Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN
router.get("/login", function(req, res){
    res.render("login", { page: "login" });
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;