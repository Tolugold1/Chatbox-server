const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
}, { timestamps: true }
)

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', userSchema);

module.exports = User;
