// SET UP
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// MIDDLEWARE
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            }
        });    
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login"); 
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login"); 
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;