const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["friendRequest", "friendRequestAccepted", "likePost", "likeComment", "comment", "replyComment"],
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  schemaOptions,
);

module.exports = mongoose.model("Notification", NotificationSchema);
