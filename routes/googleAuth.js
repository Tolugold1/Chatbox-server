var express = require('express');
var google = express.Router();
const cors = require('./cors');
const passport = require('passport');
const authenticate = require("../authenticate");
const User = require("../Model/user")
require("dotenv").config();

// using google to sign-in

google.get("/google", cors.cors, passport.authenticate("google", { scope: ["profile", 'email']}));

google.get('/google/redirect', passport.authenticate('google', { successRedirect: process.env.FRONTEND + "/Home", failureRedirect: process.env.FRONTEND }));

google.get("/success", cors.corsWithOption, (req, res, next) => {
    if (req.user) {
        var token = authenticate.getToken({_id: req.user._id})
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json({success: true, status: "Sign in successful", token: token, userDetails: req.user})
    }
})

google.get("/linkedin", passport.authenticate('linkedin', {state: 'profile'}));

google.get("/linkedin/redirect", passport.authenticate('linkedin', { successRedirect: process.env.FRONTEND + "/Home", failureRedirect: process.env.FRONTEND }))

google.get("/linkedinsuccess", cors.corsWithOption, (req, res) => {
    if (req.user) {
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, status: "Sign in successful", token: token, userDetails: req.user});
    }
})

module.exports = google;
