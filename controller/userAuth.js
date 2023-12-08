const { handleResponse } = require("../utils/helper");
const service = require("../service/userAuth");

exports.signup = async (req, res, next) => {
  try {
    const data = await service.signup({username: req.body.username, password: req.body.password, confirmPassword: req.body.confirmPassword, email: req.body.email});
    handleResponse({
      res,
      status: 200,
      message: "Account created successully",
      data: data
    });
  } catch (err) {
    next(err);
  }
}

exports.signin = async (req, res, next) => {
  try {
    const data = await service.signin({username: req.body.username, password: req.body.password,});
    handleResponse({
      res,
      status: 200,
      message: "Sign in successful",
      data: data
    });
  } catch (err) {
    next(err);
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await service.getUsers(req.params.id);
    handleResponse({
      res,
      status: 200,
      message: "All users",
      data: data
    });
  } catch (err) {
    next(err);
  }
}
