const Router = require("express").Router();
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const chatRouter = require("./chat.route");
const messageRouter = require("./message.route");
const postRouter = require("./post.route");
const hobbyRouter = require("./hobby.route");

const notificationRouter = require("./notification.route");

const commentRouter = require("./comment.route");

Router.use("/auth", authRouter);
Router.use("/user", userRouter);
Router.use("/post", postRouter);
Router.use("/hobby", hobbyRouter);
Router.use("/chat", chatRouter);
Router.use("/message", messageRouter);
Router.use("/notification", notificationRouter);
Router.use("/comment", commentRouter);

module.exports = Router;
