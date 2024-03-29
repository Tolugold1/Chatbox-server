require("dotenv").config()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./Model/user')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


exports.getToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY )
}

const opt = {}
opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = process.env.SECRET_KEY

exports.jwtPassport = passport.use(new jwtStrategy(opt, (jwt_payload, done) => {
  User.findOne({"_id": jwt_payload._id}, (err, user) => {
    if (err) {
      return done(err, false)
    } else if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}));

exports.verifyUser = passport.authenticate("jwt", {session: "false"});

// google OAuth
exports.googlePassport = passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BACKEND + "/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (err) {
        return done(err, false)
      } else if (!err && user !== null) {
        return done(null, user);
      } else {
        user = new User({username: profile.displayName});
        user.email = profile.emails[0].value
        user.googleId = profile.id
        user.save((err, user) => {
            if (err) {
                return done(err, false)
            } else {
                return done(null, user);
            }
        })
      }
    })
  }
));

// linkedin OAuth

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: process.env.BACKEND + "/auth/linkedin/redirect",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({linkedinId: profile.id}, (err, user) => {
    if (err) {
      return done(err, false)
    } else if (!err && user !== null) {
      return done(null, user)
    } else {
      user = new User({username: profile.displayName});
      user.linkedinId = profile.id;
      user.email = profile.emails[0].value;
      user.save((err, user) => {
        if (err) {
          return done(err, false)
        } else {
          return done(null, user)
        }
      })
    }
  })
}));
