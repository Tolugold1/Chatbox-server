var express = require('express');
var google = express.Router();
const cors = require('./cors');
const passport = require('passport');
const authenticate = require("../authenticate");
const User = require("../Model/user")


// using google to sign-in

google.get("/google", cors.cors, passport.authenticate("google", { scope: ["profile", 'email']}), (req, res) => {
    var token = authenticate.getToken({_id: req.user._id});
    console.log("token", token)
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({success: true, status: "sign in successful", token: token, userId: req.user._id})
});

google.get('/google/redirect', passport.authenticate('google', { successRedirect: "http://localhost:3001/Home", failureRedirect: 'http://localhost:3001/' }), (req, res) => {

});

google.get("/success", cors.corsWithOption, (req, res, next) => {
    console.log("req.user", req.user)
    if (req.user) {
        var token = authenticate.getToken({_id: req.user._id})
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json({success: true, status: "Sign in successful", token: token, userId: req.user._id})
    }
})

module.exports = google;
