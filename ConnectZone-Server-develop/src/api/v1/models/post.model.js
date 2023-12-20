const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    shares: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["public", "private", "friend"],
      default: "public",
    },
  },
  schemaOptions,
);

module.exports = mongoose.model("Post", PostSchema);
