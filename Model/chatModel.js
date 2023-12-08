const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  chatIDs: Array
}, { timestamps: true})

const ChatIDs = mongoose.model("chat", chatSchema);

module.exports = ChatIDs;
