const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const ChatSchema = new Schema(
  {
    name: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  schemaOptions,
);

module.exports = mongoose.model("Chat", ChatSchema);
