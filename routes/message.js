const express = require("express");
const bodyparser = require("body-parser");
const Message = require("../Model/Message");
const messageRouter = express.Router();
messageRouter.use(bodyparser.json())
const cors = require("./cors");
const authenticate = require("../authenticate");
const controller = require("../controller/chatController");

messageRouter.options(cors.corsWithOption, (req, res, next) => { res.sendStatus(200)})

messageRouter.get("/getChat/:myId/:otherId", cors.cors, authenticate.verifyUser, controller.getChat);

messageRouter.post("/pstmsg", cors.corsWithOption, authenticate.verifyUser, controller.SendMsg);

// messageRouter.put("/ptmsg", cors.corsWithOption, authenticate.verifyUser, );

messageRouter.delete("/dtmsg", cors.corsWithOption, authenticate.verifyUser, );

messageRouter.post("/mymsg", cors.corsWithOption, authenticate.verifyUser, )

module.exports = messageRouter;