const ChatIDs = require("../Model/chatModel");
const Message = require("../Model/Message");
const helper = require("../utils/helper");
const { NotFoundError } = require("../utils/errors");

// get chats
exports.getChat = async ({myId, otherId}) => {
  try {
    console.log(myId, otherId)
    const chatbox = await ChatIDs.find({chatIDs: {$all: [myId, otherId]}});
    console.log("chatbox", chatbox)
    if (chatbox.length === 0) throw NotFoundError("No messages yet!.");
    let chat = await Message.findOne({chatId: chatbox[0]._id}).lean();
    return chat;
  } catch (error) {
    throw error;
  }
}

// initial a chat and end a message
exports.sendMessage = async ({firstId, secondId, senderId, message}) => {
  try {
    // establish a chatbox;
    let result;
    const chatbox = await ChatIDs.find({chatIDs: {$all: [firstId, secondId]}});
    console.log("chatBox", chatbox)
    if (chatbox.length !== 0) {
      //  send message
      result = await helper.createMessage({chatId: chatbox[0]._id, senderId: senderId, message: message})
    } else {
      // create a chatbox
      console.log(firstId, secondId)
      let chatBox = await helper.createChat({firstId, secondId});
      console.log("chatBox", chatBox)
      result = await helper.createMessage({chatId: chatBox._id, senderId: senderId, message: message})
    }
    return result;
  } catch (err) {
    throw err;
  }
}



