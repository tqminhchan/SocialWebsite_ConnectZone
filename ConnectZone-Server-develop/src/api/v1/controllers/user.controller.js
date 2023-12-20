const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const bcrypt = require("bcrypt");
const io = require("socket.io");

const userController = {
  getUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findOne({ _id: userId })
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      return res.status(200).json({
        success: true,
        message: "Lấy thông tin thành công",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lấy thông tin thất bại",
      });
    }
  },
  updateUser: async (req, res) => {
    const userId = req.userId;
    const { fullName, dateOfBirth, gender, address, bio } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { fullName, dateOfBirth, gender, address, bio },
        { new: true },
      )
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Cập nhật thông tin thất bại",
      });
    }
  },
  updateAvatar: async (req, res) => {
    const userId = req.userId;
    const avatar = req.avatar;
    try {
      const user = await User.findOneAndUpdate({ _id: userId }, { avatar }, { new: true })
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      return res.status(200).json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Cập nhật ảnh đại diện thất bại",
      });
    }
  },
  updateBackground: async (req, res) => {
    const userId = req.userId;
    const background = req.background;
    try {
      const user = await User.findOneAndUpdate({ _id: userId }, { background }, { new: true })
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      return res.status(200).json({
        success: true,
        message: "Cập nhật ảnh bìa thành công",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Cập nhật bìa thất bại",
      });
    }
  },
  changePassword: async (req, res) => {
    const { password, newPassword } = req.body;
    const userId = req.userId;
    if (!password || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });

    try {
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu cũ không đúng",
        });
      }
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Cập nhật mật khẩu thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Cập nhật mật khẩu thất bại",
      });
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.userId;
    try {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({
        success: true,
        message: "Xóa tài khoản thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Xóa tài khoản thất bại",
      });
    }
  },
  searchUser: async (req, res) => {
    const { searchValue } = req.body;
    if (searchValue.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin tìm kiếm",
      });
    }

    const searchTerm = searchValue.split(" ");

    let regexString = "";
    for (let i = 0; i < searchTerm.length; i++) {
      regexString += searchTerm[i];
      if (i < searchTerm.length - 1) regexString += "|";
    }

    let { page = 1, limit = 10 } = req.query;
    try {
      if (!searchValue) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin tìm kiếm",
        });
      }

      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;
      const users = await User.find({
        fullName: new RegExp(regexString, "ig"),
      })
        .limit(limit)
        .skip(skip)
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends");
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng nào phù hợp",
        });
      }

      const totalUsers = await User.countDocuments({
        $text: { $search: searchValue },
      });
      const totalPages = Math.ceil(totalUsers / limit);

      return res.status(200).json({
        success: true,
        message: "Tìm kiếm thành công",
        metadata: {
          page,
          limit,
          totalPages,
          total: totalUsers,
        },
        users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Tìm kiếm thất bại",
      });
    }
  },
  searchListFriend: async (req, res) => {
    const { searchValue, userId } = req.body;

    const searchTerm = searchValue.split(" ");

    let regexString = "";
    for (let i = 0; i < searchTerm.length; i++) {
      regexString += searchTerm[i];
      if (i < searchTerm.length - 1) regexString += "|";
    }

    let { page = 1, limit = 10 } = req.query;
    try {
      if (!searchValue) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin tìm kiếm",
        });
      }

      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;
      const user = await User.findById(userId);
      const users = await User.find({
        _id: { $in: user?.friends },
        fullName: new RegExp(regexString, "ig"),
      })
        .limit(limit)
        .skip(skip)
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends");

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng nào phù hợp",
        });
      }

      const totalUsers = await User.countDocuments({
        $text: { $search: searchValue },
      });
      const totalPages = Math.ceil(totalUsers / limit);

      return res.status(200).json({
        success: true,
        message: "Tìm kiếm thành công",
        metadata: {
          page,
          limit,
          totalPages,
          total: totalUsers,
        },
        users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Tìm kiếm thất bại",
      });
    }
  },
  sendFriendRequest: async (req, res) => {
    try {
      const { userId, friendId } = req.body;
      const sender = await User.findById(userId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends");

      const receiver = await User.findById(friendId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");

      const isFriend = sender?.friends.some((friend) => friend._id.equals(friendId));
      const isRequestSent = receiver?.friendRequests.some((request) => request.equals(userId));

      if (isFriend) {
        return res.status(400).json({
          success: false,
          message: "Hai bạn đã là bạn bè rồi, không thể gửi lời mời kết bạn",
        });
      } else {
        if (isRequestSent) {
          return res.status(200).json({
            success: false,
            message: "Lời mời kết bạn đã được gửi rồi, không thể gửi lại",
          });
        } else {
          sender.friendRequestsSent.push(receiver);
          receiver.friendRequests.push(sender);
          receiver.notificationUnread += 1;
          await sender.save();
          await receiver.save();

          res.status(200).json({
            success: true,
            message: "Gửi lời mời kết bạn thành công",
            sender,
            receiver,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "gui loi moi that bai",
      });
    }
  },
  cancelFriendRequest: async (req, res) => {
    const { userId, friendId } = req.body;
    const sender = await User.findById(userId)
      .populate("friends", "_id fullName avatar createdAt gender friends")
      .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends")
      .populate("friendRequests", "_id fullName avatar createdAt gender friends");

    const receiver = await User.findById(friendId)
      .populate("friends", "_id fullName avatar createdAt gender friends")
      .populate("friendRequests", "_id fullName avatar createdAt gender friends")
      .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");

    const isFriend = sender?.friends.some((friend) => friend._id.equals(friendId));

    if (isFriend) {
      return res.status(400).json({
        success: false,
        message: "Hai nguoi da la ban be",
        sender,
        receiver,
      });
    } else {
      sender.friendRequestsSent = sender.friendRequestsSent.filter((item) => {
        return item?._id.valueOf() !== friendId;
      });
      receiver.friendRequests = receiver.friendRequests.filter((item) => {
        return item?._id.valueOf() !== userId;
      });
      await sender.save();
      await receiver.save();

      res.status(200).json({
        success: true,
        message: "Huy loi moi ket ban thanh cong",
        sender,
        receiver,
      });
    }
  },
  sendAcceptFriendRequest: async (req, res) => {
    const { userId, friendId } = req.body;

    try {
      const senderAccept = await User.findById(userId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends");

      const receiverAccept = await User.findById(friendId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");

      const isFriend = senderAccept?.friends.some((friend) => friend._id.equals(friendId));
      if (isFriend) {
        return res.status(400).json({
          success: false,
          message: "Hai người đã là bạn bè, không thể đồng ý kết bạn nữa",
        });
      } else {
        senderAccept.friendRequests = senderAccept.friendRequests.filter((item) => {
          return item?.id.valueOf() !== friendId;
        });
        receiverAccept.friendRequestsSent = receiverAccept.friendRequestsSent.filter((item) => {
          return item?.id.valueOf() !== userId;
        });
        senderAccept.friends.push(receiverAccept);
        receiverAccept.friends.push(senderAccept);
        receiverAccept.notificationUnread += 1;
        await senderAccept.save();
        await receiverAccept.save();

        res.status(200).json({
          success: true,
          message: "Chấp nhận lời mời kết bạn thành công",
          senderAccept,
          receiverAccept,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: "Chấp nhận lời mời kết bạn thất bại",
      });
    }
  },
  deleteFriend: async (req, res) => {
    const { userId, friendId } = req.body;

    try {
      const sender = await User.findById(userId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends");

      const receiver = await User.findById(friendId)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends");

      sender.friends = sender.friends.filter((item) => {
        return item?.id.valueOf() !== friendId;
      });
      receiver.friends = receiver.friends.filter((item) => {
        return item?.id.valueOf() !== userId;
      });

      await sender.save();
      await receiver.save();

      res.status(200).json({
        success: true,
        message: "Hủy kết bạn thành công",
        sender,
        receiver,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: "Chấp nhận lời mời kết bạn thất bại",
      });
    }
  },
  getListFriendSuggestion: async (req, res) => {
    let { page = 1, limit = 12 } = req.query;
    try {
      page = Number(page);
      limit = Number(limit);
      const skip = (page - 1) * limit;

      const userId = req.userId;
      const user = await User.findById(userId);
      const users = await User.find({
        $and: [
          { _id: { $ne: userId } },
          { _id: { $nin: user.friends } },
          { _id: { $nin: user.friendRequests } },
          { _id: { $nin: user.friendRequestsSent } },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const totalUsers = await User.countDocuments({
        $and: [
          { _id: { $ne: userId } },
          { _id: { $nin: user.friends } },
          { _id: { $nin: user.friendRequests } },
          { _id: { $nin: user.friendRequestsSent } },
        ],
      });
      const totalPages = Math.ceil(totalUsers / limit);

      return res.status(200).json({
        success: true,
        metadata: {
          page,
          limit,
          totalPages,
          total: totalUsers,
        },
        users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ",
      });
    }
  },
  getAllListFriend: async (req, res) => {
    const { userId } = req.query;

    try {
      const user = await User.findById(userId);
      const users = await User.find({
        _id: { $in: user.friends },
      }).populate("friends", "_id fullName avatar createdAt gender friends");

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ",
      });
    }
  },
  readAllNotifications: async (req, res) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId);
      user.notificationUnread = 0;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Đã đọc tất cả thông báo",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ",
      });
    }
  },
};

module.exports = userController;
