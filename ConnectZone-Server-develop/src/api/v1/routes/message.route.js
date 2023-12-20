const Router = require("express").Router();

const messageController = require("../controllers/message.controller");
const verifyToken = require("../middlewares/verifyToken");
const { uploadMedia } = require("../utils/multer");
const uploadSingleFile = require("../middlewares/uploadSingleFile");

Router.get("/", verifyToken, messageController.getMessagesByChatId);
Router.post("/", verifyToken, messageController.createMessage);
Router.post(
  "/upload-single-file",
  verifyToken,
  uploadMedia.single("singleMedia"),
  uploadSingleFile.uploadSingleFileChat,
);
Router.delete("/:id", verifyToken, messageController.deleteMessageById);

module.exports = Router;
