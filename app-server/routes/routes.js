var express = require("express");
var User = require("../../app-api/models/user");
var Bar = require("../../app-api/models/bar");
var Barbito = require("../../app-api/models/barbito");
var passport = require("passport");
var ctrlData = require("../../app-api/controllers/api-data.js")
var ctrlView = require("../controllers/view-ctrl.js")



var router = express.Router(); 

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

// display bars in the selected city (post) or nothing
router.get("/", ctrlView.getData);
router.post("/city", ctrlView.getData); //ZGQ for whatever reasons, using form get method fails to get req.body.city????
router.get("/city/:city", ctrlView.getData);
router.get("/shops/barbito", ctrlView.getBarbito);
router.get("/shops/go/*", ctrlView.updateBarbito);

router.get("/api/shops/search", ctrlData.getData);
router.get("/api/shops/barbito", ctrlData.getBarbito);
router.post("/api/shops/go/*", ctrlData.updateBarbito);
//router.get("/shops/nogo/:bar", ctrlData.postBarbitoNoGo);


router.get("/users/:username", function(req, res, next){
    console.log("ZG: username is:", req.params.username);
    User.findOne({username: req.params.username}, function(err, user){
        if(err) {return next(err);}
        if(!user) {return next(404);}
        console.log("router.username: before render: username = ", user.username, " currentUser = ", res.locals.currentUser);
        res.render("profile", {user: user});
        console.log("router.username: after render: username = ", user.username, " currentUser = ", res.locals.currentUser);
    });
});


router.get("/signup", function(req, res){
    res.render("../views/signup");
});

router.post("/signup", function(req, res, next){
    var username = req.body.username; //body-parser adds the username and pwd to req.body
    var password = req.body.password;
    
    User.findOne({username: username}, function(err, user){ //calls findOne to return just one user on username
        if (err) return next(err);
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }
        
        var newUser = new User({
            username: username,
            password: password
        });
        newUser.save(next); //save the new user to db and continues to the next handler
    });
}, passport.authenticate("login", { //authenticate the user
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get("/login", function(req, res){
    res.render("../views/login");
})

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


router.get("/edit", ensureAuthenticated, function(req, res){
    //console.log("ZG inside edit -> displayName = ");
    res.render("../views/edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next){
    req.user.displayName = req.body.displayname;
    req.user.bio = req.body.bio;
    req.user.save(function(err){
        if(err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/edit");
    });
});

function ensureAuthenticated(req, res, next) {
    console.log("ZG enter ensureAuthenticated");
    if(req.isAuthenticated()) { //a function provided by passport
        console.log("ZG: inside ensureAuthenticated - ", req.isAuthenticated());
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

module.exports = router;

