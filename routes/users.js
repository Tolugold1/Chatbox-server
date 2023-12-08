require("dotenv").config();
var express = require('express');
var router = express.Router();
const cors = require('./cors');
const User = require("../Model/user")
const passport = require('passport');
const authenticate = require("../authenticate");
const controller = require("../controller/userAuth")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/signup", cors.corsWithOption, controller.signup);


router.post("/signin", cors.corsWithOption, controller.signin)

// get registered developers

router.get("/getUsers/:id", cors.corsWithOption, authenticate.verifyUser, controller.getAllUsers)


router.post("/signout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      console.log(err)
      return next(err)
    }
    res.json({status: process.env.FRONTEND})
  })
})

module.exports = router;
