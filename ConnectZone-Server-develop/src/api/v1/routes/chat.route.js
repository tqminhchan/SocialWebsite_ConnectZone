const Router = require("express").Router();

const chatController = require("../controllers/chat.controller");
const verifyToken = require("../middlewares/verifyToken");

Router.get("/", verifyToken, chatController.getAllChats);
Router.get("/get-chat-by-userId", verifyToken, chatController.getChatByUserId);
Router.get("/:id", verifyToken, chatController.getChatByChatId);
Router.post("/createGroupChat", verifyToken, chatController.createGroupChat);
Router.post("/", verifyToken, chatController.createChat);
Router.put("/updateNameGroupChat/:id", verifyToken, chatController.updateNameGroupChat);
Router.post("/addUsersToGroup", verifyToken, chatController.addUsersToGroup);
Router.post("/removeUserFromGroup", verifyToken, chatController.removeUserFromGroup);
Router.post("/leaveGroupChat", verifyToken, chatController.leaveGroupChat);

module.exports = Router;
