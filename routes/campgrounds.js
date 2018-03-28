// SET UP

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// =======================
// CAMPGROUND ROUTES
// =======================

// INDEX - Camps page
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);
        } 
        else {
                res.render("campgrounds/index", { campgrounds : campgrounds, page: "campgrounds"});
        }
    });
});

// CREATE - Add new campgraounds to database
router.post("/", middleware.isLoggedIn, function(req, res){
    var campground = req.body.campground;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    campground.author = author;
    Campground.create(campground, function(err, newCampground){
        if (err) {
            console.log(err);
        } 
        else {
            req.flash("success", "Successfully added campground");
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Displays a form for additional campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows more information about the campground selected
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } 
        else {
            res.render("campgrounds/show", { campground : foundCampground });
        }
    });
});

// EDIT 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    }); 
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Successfully edited campground");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;