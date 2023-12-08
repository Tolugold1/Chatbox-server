const ChatIDs = require("../Model/chatModel");
const Message = require("../Model/Message");

// initial a chat and end a message
exports.createChat = async ({firstId, secondId}) => {
  // establish a chatbox;
  console.log(firstId, secondId)
  const chatbox = await ChatIDs.find({chatIDs: {$all: [firstId, secondId]}});
  if (chatbox.length !== 0) return chatbox;
  const newChat = new ChatIDs({
    chatIDs: [firstId, secondId]
  });
  const response = await newChat.save();
  console.log("response", response)
  return response;
}

exports.createMessage = async ({chatId, senderId, message}) => {
  console.log("box", chatId)
  if (chatId !== undefined || chatId !== null) {
    let result;
    const msg = await Message.findOne({chatId: chatId});
    if (msg) {
      msg.body.push({senderId: senderId, message: message});
      result = await msg.save();
    } else {
      // create a new message doc
      let newMsg = new Message({
        chatId: chatId,
        body: [{
          senderId: senderId,
          message: message
        }]
      });
      result = await newMsg.save();
    }
    return result;
  }
}

exports.handleResponse = ({res, status, message, data}) => {
  return res.status(status).json({
    success: true,
    status: message,
    data: data !== null ? data : null
  })
}

