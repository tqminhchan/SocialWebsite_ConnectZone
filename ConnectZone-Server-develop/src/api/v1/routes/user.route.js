const Router = require("express").Router();

const { uploadMedia } = require("../utils/multer");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const uploadSingleFile = require("../middlewares/uploadSingleFile");

Router.get("/list-friend-suggestion", verifyToken, userController.getListFriendSuggestion);
Router.get("/list-friend", verifyToken, userController.getAllListFriend);

Router.get("/:id", verifyToken, userController.getUser);

Router.put("/", verifyToken, userController.updateUser);
Router.put(
  "/update-avatar",
  verifyToken,
  uploadMedia.single("avatar"),
  uploadSingleFile.uploadSingleFileAvatar,
  userController.updateAvatar,
);
Router.put(
  "/update-background",
  verifyToken,
  uploadMedia.single("background"),
  uploadSingleFile.uploadSingleFileBackground,
  userController.updateBackground,
);

Router.put("/change-password", verifyToken, userController.changePassword);

Router.delete("/", verifyToken, userController.deleteUser);
Router.post("/search", verifyToken, userController.searchUser);
Router.post("/search-list-friend", verifyToken, userController.searchListFriend);

Router.post("/send-friend-request", verifyToken, userController.sendFriendRequest);
Router.post("/cancel-friend-request", verifyToken, userController.cancelFriendRequest);
Router.post("/send-friend-accept", verifyToken, userController.sendAcceptFriendRequest);
Router.post("/delete-friend", verifyToken, userController.deleteFriend);

Router.post("/read-all-notifications", verifyToken, userController.readAllNotifications);

module.exports = Router;
