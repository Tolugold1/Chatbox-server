const { handleResponse } = require("../utils/helper");
const service = require("../service/Chat");

exports.getChat = async (req, res, next) => {
  try {
    const data = await service.getChat({myId: req.params.myId, otherId: req.params.otherId});
    handleResponse({
      res,
      status: 200,
      message: "This is your chat",
      data: data
    });
  } catch (err) {
    next(err);
  }
}

exports.SendMsg = async (req, res, next) => {
  try {
    const data = await service.sendMessage({firstId: req.body.firstId, secondId: req.body.secondId, senderId: req.body.senderId, message: req.body.message});
    handleResponse({
      res,
      status: 200,
      message: "Message sent successfully",
      data: data
    });
  } catch (err) {
    next(err);
  }
}

// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const data = await service.getUsers();
//     handleResponse({
//       res,
//       status: 200,
//       message: "All users",
//       data: data
//     });
//   } catch (err) {
//     next(err);
//   }
// }
