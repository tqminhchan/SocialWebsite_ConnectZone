const Router = require("express").Router();
const { uploadMedia } = require("../utils/multer");

const postController = require("../controllers/post.controller");
const verifyToken = require("../middlewares/verifyToken");
const uploadMediaFiles = require("../middlewares/uploadMediaFiles");
const deleteMediaFiles = require("../middlewares/deleteMediaFiles");
const deleteSingleFile = require("../middlewares/deleteSingleFile");

// tạo 1 bài viết + upload file ảnh và video lên cloudianry
Router.post("/create-post", verifyToken, postController.createAPost);
Router.post(
  "/upload-media-files",
  verifyToken,
  uploadMedia.array("media", 10),
  uploadMediaFiles,
  postController.uploadMultimediaFiles,
);

// lấy toàn bộ bài viết của người dùng
Router.get("/get-all-profile-posts", verifyToken, postController.getAllUserPosts);

Router.get("/get-friends-post", verifyToken, postController.getFriendsPost);

// xoá bài viết + xoá file ảnh và video trên cloudinary
Router.delete("/delete-post/:id", verifyToken, postController.deleteAPost);
Router.delete("/delete-media-files", verifyToken, deleteMediaFiles);

// xoá 1 file ảnh hoặc video trên cloudinary
Router.delete("/delete-single-file/:postId/:fileId", verifyToken, deleteSingleFile);

// cập nhật bài viết
Router.put(
  "/update-a-post/:id",
  verifyToken,
  uploadMedia.array("media", 10),
  uploadMediaFiles,
  postController.updateAPost,
);

// lấy 1 bài viết của người dùng theo id - lấy được của mọi người
Router.get("/get-a-post-by-id/:id", verifyToken, postController.getAPostById);

module.exports = Router;
