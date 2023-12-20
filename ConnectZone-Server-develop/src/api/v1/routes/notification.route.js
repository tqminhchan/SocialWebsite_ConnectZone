const Router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const verifyToken = require("../middlewares/verifyToken");

Router.get("/", verifyToken, notificationController.getAllNotifications);
Router.post("/create-noti", verifyToken, notificationController.createNotification);
Router.post("/read-notification", verifyToken, notificationController.readNotification);

module.exports = Router;
