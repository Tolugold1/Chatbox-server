const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
  fullname: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  googleId: {
    type: String
  }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', userSchema);

module.exports = User;
