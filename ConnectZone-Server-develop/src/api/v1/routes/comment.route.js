const Router = require("express").Router();

const commentController = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/verifyToken");
const { uploadMedia } = require("../utils/multer");
const uploadMediaFiles = require("../middlewares/uploadMediaFiles");

Router.get("/get-comment-by-id/:id", verifyToken, commentController.getCommentById);

Router.post("/create-comment", verifyToken, commentController.createComment);
Router.post(
  "/upload-media-files",
  verifyToken,
  uploadMedia.array("media", 10),
  uploadMediaFiles,
  commentController.uploadMultimediaFiles,
);

Router.put(
  "/update-comment/:id",
  verifyToken,
  uploadMedia.array("media", 1),
  uploadMediaFiles,
  commentController.updateComment,
);

Router.delete("/delete-comment/:id", verifyToken, commentController.deleteComment);
Router.delete("/delete-media-files", verifyToken, commentController.deleteMediaFiles);

module.exports = Router;
