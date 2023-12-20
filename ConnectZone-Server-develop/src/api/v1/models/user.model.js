const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    hobbies: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Hobby",
      },
    ],
    avatar: {
      url: String,
      public_id: String,
    },
    background: {
      url: String,
      public_id: String,
    },
    friends: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    friendRequestsSent: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    notificationUnread: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions,
);

UserSchema.index({ fullName: "text" });

module.exports = mongoose.model("User", UserSchema);
