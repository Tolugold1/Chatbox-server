const cors = require('../routes/cors');
const User = require("../Model/user");
const authenticate = require("../authenticate");
const { AlreadyExistError, NotFoundError, InvalidDetailsError } = require("../utils/errors");
const bcrypt = require("bcrypt");

exports.signup = async ({username, password, confirmPassword, email }) => {
  console.log("password", password);
  try {
    if (username !== null && password !== null && confirmPassword !== null) {
      let user = await User.findOne({username: username});
      if (user) throw AlreadyExistError("You already have an account, kindly sign in");
      let uName = username.trim();
      let pwd = password.trim();
      let cPwd = confirmPassword.trim();
      let salt = 10;
      let hashPassword;
      if (pwd === cPwd) {
        hashPassword = bcrypt.hashSync(password, salt);
      }
      console.log("hash", hashPassword);
      // create a new acct
      let newUser = new User({
        username: uName,
        password: hashPassword,
        email: email
      });
      await newUser.save();
    }
  } catch (err) {
    throw err
  }
}

exports.signin = async ({username, password}) => {
  try {
    console.log("user", username);
    console.log("password", password)
    // find user
    let user = await User.findOne({username: username});
    if (!user) throw NotFoundError("User not found");
    let verifyPwd = bcrypt.compareSync(password, user.password);
    console.log("verify Password", verifyPwd)
    if (verifyPwd) {
      const token = authenticate.getToken({_id: user._id})
      return {user, token: token};
    } else {
      throw InvalidDetailsError("Username or password not correct");
    }
  } catch (err) {
    throw err;
  }
}

exports.getUsers = async (userId) => {
  try {
    console.log("userId", userId, typeof userId)
    let users = await User.find();
    let v = users;
    let return_data = [];
    for (let i = 0; i <= v.length - 1; i++) {
      if (v[i]._id != userId) {
        return_data.push(v[i]);
      }
    }
    console.log("users", return_data)
    return return_data;
  } catch (err) {
    throw err;
  }
}