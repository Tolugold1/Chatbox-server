const passport = require('passport')
const LocalStrategy = require('passport-local')
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./Model/user')

passport.use(new LocalStrategy(User.authenticte()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, process.env.SECRETE_KEY, {expiresIn: '1h'})
}

const opt = {}
opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = process.env.SECRETE_KEY

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