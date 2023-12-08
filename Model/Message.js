const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* const visitorSchema = new Schema({
  visitorID: {
    type: String
  },
  visitorsmsg: [{
    type: String
  }]
}) */

const messageSchema = new Schema({
  chatId: String,
  body: [ new Schema({
    senderId: String,
    message: String
  }, {timestamps: true})]
}, { timestamps: true })

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
