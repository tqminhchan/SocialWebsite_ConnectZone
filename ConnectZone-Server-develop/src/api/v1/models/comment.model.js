const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    media: [
      {
        url: String,
        public_id: String,
        resource_type: String,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentParent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    commentReply: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  schemaOptions,
);

module.exports = mongoose.model("Comment", CommentSchema);
