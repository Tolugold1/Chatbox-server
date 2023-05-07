var express = require('express');
var router = express.Router();
const cors = require('./cors');
const User = require("../Model/user")
const passport = require('passport');
const authenticate = require("../authenticate");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/signup", cors.corsWithOption, (req, res) => {
  console.log(req.body)
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({success: false, status: err})
    } else {
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.fullname) {
        user.fullname = req.body.fullname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({err: err});
          return ;
        }

        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({success: true, status: "Registration successful"});
        });
      })
    }
  })
})


router.post("/signin", cors.corsWithOption,  (req, res, next) => {
  console.log(req.body)
  passport.authenticate("local", (err, user, info) => {
    if (err) { return next(err);}
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({success: false, status: "signin not successful", err: info})
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.statusCode = 401;
        return res.setHeader("Content-Type", "application/json");
        return res.json({succes: false, status: "Login unsuccesful", err: "User could not be logged in successfully."})
        return ;
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({success: true, status: "sign in successful", token: token, userId: req.user._id})
    });
  }) (req, res, next)
})

router.post("/signout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      console.log(err)
      return next(err)
    }
    res.json({status: "http://localhost:3001/"})
  })
})

module.exports = router;
