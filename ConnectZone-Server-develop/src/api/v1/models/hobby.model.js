const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { schemaOptions } = require("./modelOptions");

const HobbySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  schemaOptions,
);

module.exports = mongoose.model("Hobby", HobbySchema);
