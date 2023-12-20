const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  schemaOptions,
);

module.exports = mongoose.model("Message", MessageSchema);
