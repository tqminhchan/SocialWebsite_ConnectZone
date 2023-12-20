const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const indexRouter = require("./src/api/v1/routes/index.route");
const Post = require("./src/api/v1/models/post.model");
const Notification = require("./src/api/v1/models/notification.model");
const User = require("./src/api/v1/models/user.model");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const mongoUri = process.env.MONGODB_URL;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB at ${process.env.MONGODB_URL}`);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use("/api/v1", indexRouter);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("sendFriendRequest", async ({ user, friendSend }) => {
    let notification = await Notification.create({
      user: friendSend.id,
      sender: user.id,
      content: `${user?.fullName} đã gửi lời mời kết bạn cho bạn`,
      type: "friendRequest",
    });

    notificationPopulate = await Notification.findById(notification?.id).populate("user").populate("sender");
    io.emit("sendNotiFriend", {
      user: user,
      type: "friendRequest",
      receiver: friendSend,
      notification: notificationPopulate,
    });
  });
  socket.on("cancelSentFriendRequest", ({ user, friendRequest }) => {
    const isFriend = user.friends.some((friend) => friend?._id.valueOf() === friendRequest?.id);
    if (isFriend) {
      io.emit("canNotSendAgain", {
        notification: {
          user: friendRequest,
          content: `Hai bạn đã là bạn bè, không thể hủy lời mời`,
        },
      });
    } else {
      io.emit("sendNotiCancelSentFriendRequest", {
        user: user,
        receiver: friendRequest,
      });
    }
  });
  socket.on("acceptFriendRequest", async ({ user, friendAccepted }) => {
    let notification = await Notification.create({
      user: friendAccepted.id,
      sender: user.id,
      content: `${user?.fullName} đã chấp nhận lời mời kết bạn`,
      type: "friendRequestAccepted",
    });
    notificationPopulate = await Notification.findById(notification?.id).populate("user").populate("sender");
    io.emit("sendNotiFriendAccepted", {
      user: user,
      type: "friendRequestAccepted",
      receiverAccepted: friendAccepted,
      notification: notificationPopulate,
    });
  });
  socket.on("joinChat", (room) => {
    socket.join(room);
    socket.to(room).emit("notijoinchat", { message: "ban da ket noi voi nguoi nay" });
  });
  socket.on("isTyping", (room, userChatId) => {
    socket.broadcast.to(room).emit("isTyping", { message: "ai do dang chat", userChatId: userChatId });
  });
  socket.on("stopTyping", (room) => {
    socket.to(room).emit("stopTyping", { message: "da nhan nut gui tin nhan" });
  });
  socket.on("sendMessage", (message, room) => {
    socket.to(room).emit("receiveMessage", { message: message, chatId: room });
  });
  socket.on("likePost", async ({ user, post: postPram, likes }) => {
    const isLiked = likes.some((id) => id === user?._id);
    if (isLiked) {
      const post = await Post.findByIdAndUpdate(
        postPram.id,
        {
          $pull: { likes: user._id },
        },
        { new: true },
      );
      io.emit("likePost", {
        post: post,
      });
    } else {
      const post = await Post.findByIdAndUpdate(
        postPram.id,
        {
          $push: { likes: user._id },
        },
        { new: true },
      ).populate("user");
      let notification = null;
      let notificationClone = null;
      if (post?.user?.id !== user?.id) {
        notification = await Notification.create({
          user: post.user.id,
          sender: user.id,
          content: `${user?.fullName} đã thích bài viết của bạn`,
          type: "likePost",
          post: post.id,
        });
        notificationClone = await Notification.findById(notification?.id).populate("user").populate("sender");
      }

      io.emit("likePost", {
        post: post,
        notification: notificationClone,
      });
    }
  });
});
