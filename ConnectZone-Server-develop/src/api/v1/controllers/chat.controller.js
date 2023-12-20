const Chat = require("../models/chat.model");

const chatController = {
  createChat: async (req, res) => {
    const { userId } = req.body;
    const currentUserId = req.userId;
    try {
      const chat = await Chat.create({
        isGroupChat: false,
        users: [userId, currentUserId],
      });

      const fullChat = await Chat.findOne({
        _id: chat._id,
      }).populate("users", "-password");

      return res.status(200).json({
        success: true,
        message: "Tạo cuộc trò chuyện thành công",
        chat: fullChat,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tạo cuộc trò chuyện thất bại",
      });
    }
  },

  getAllChats: async (req, res) => {
    const userId = req.userId;
    let { page = 1, limit = 1000 } = req.query;
    try {
      page = Number(page);
      limit = Number(limit);
      const skip = (page - 1) * limit;

      let chats = await Chat.find({ users: { $elemMatch: { $eq: userId } }, latestMessage: { $exists: true } })
        .populate("users", "-password")
        .populate("groupAdmins", "-password")
        .populate("latestMessage")
        .limit(limit)
        .skip(skip)
        .sort({ updatedAt: -1 });

      chats = chats.sort((a, b) => {
        return b.latestMessage.createdAt - a.latestMessage.createdAt;
      });

      if (chats.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Người dùng chưa có cuộc trò chuyện nào",
        });
      }

      const totalChats = await Chat.countDocuments({
        users: { $elemMatch: { $eq: userId } },
        latestMessage: { $exists: true },
      });
      const totalPages = Math.ceil(totalChats / limit);

      return res.status(200).json({
        success: true,
        metadata: {
          page,
          limit,
          totalPages,
          total: totalChats,
        },
        chats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lấy danh sách cuộc trò chuyện thất bại",
      });
    }
  },

  getChatByChatId: async (req, res) => {
    let { chatId } = req.query;
    try {
      const chat = await Chat.findOne({
        _id: chatId,
      })
        .populate("users", "-password")
        .populate("groupAdmins", "-password")
        .populate("latestMessage");

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Đoạn chat không tồn tại",
        });
      }

      return res.status(200).json({
        success: true,
        chat,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lấy đoạn chat thất bại",
      });
    }
  },

  getChatByUserId: async (req, res) => {
    const currentUserId = req.userId;
    let { userId } = req.query;
    try {
      const chat = await Chat.findOne({
        users: { $all: [userId, currentUserId] },
      })
        .populate("users", "-password")
        .populate("groupAdmins", "-password")
        .populate("latestMessage");

      if (!chat) {
        const newChat = await Chat.create({
          isGroupChat: false,
          users: [userId, currentUserId],
        });

        const chatCreate = await Chat.findOne({
          users: { $all: [userId, currentUserId] },
        })
          .populate("users", "-password")
          .populate("groupAdmins", "-password")
          .populate("latestMessage");

        return res.status(200).json({
          success: true,
          chat: chatCreate,
        });
      }

      return res.status(200).json({
        success: true,
        chat,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lấy đoạn chat thất bại",
      });
    }
  },

  createGroupChat: async (req, res) => {
    const { users, name } = req.body;
    const userId = req.userId;
    if (!users || !name) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đủ các thông tin bắt buộc" });
    }

    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất 2 người dùng để tạo nhóm",
      });
    }

    users.push(userId);

    try {
      const groupChat = await Chat.create({
        name: name,
        users: users,
        isGroupChat: true,
        groupAdmins: [userId],
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmins", "-password");

      res.status(200).json({
        success: true,
        message: "Tạo nhóm thành công",
        groupChat: fullGroupChat,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Tạo nhóm thất bại",
      });
    }
  },

  updateNameGroupChat: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const chat = await Chat.findById(id)
        .populate("users", "-password")
        .populate("groupAdmins", "-password")
        .populate("latestMessage");
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhóm trò chuyện",
        });
      }
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tên nhóm trò chuyện",
        });
      }

      chat.name = name;
      await chat.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật tên nhóm trò chuyện thành công",
        groupChat: chat,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Cập nhật tên nhóm trò chuyện không thành công",
      });
    }
  },

  removeUserFromGroup: async (req, res) => {
    const { chatId, userId } = req.body;
    const currentUserId = req.userId;

    try {
      const chat = await Chat.findOne({ _id: chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhóm trò chuyện",
        });
      }
      if (!chat.groupAdmins.includes(currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xóa thành viên khỏi nhóm",
        });
      }
      chat.users = chat.users.filter((user) => user !== userId);
      await chat.save();

      res.status(200).json({
        success: true,
        message: "Xóa người dùng khỏi nhóm thành công",
        chat: chat,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Xóa người dùng khỏi nhóm không thành công",
      });
    }
  },

  leaveGroupChat: async (req, res) => {
    const currentUserId = req.userId;
    const { chatId } = req.body;
    try {
      const chat = await Chat.findOne({ _id: chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhóm trò chuyện",
        });
      }
      chat.users = chat.users.filter((user) => user !== currentUserId);
      await chat.save();
      return res.status(200).json({
        success: true,
        message: "Rời khỏi nhóm thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Rời khỏi nhóm không thành công",
      });
    }
  },

  addUsersToGroup: async (req, res) => {
    const { chatId, users } = req.body;
    const currentUserId = req.userId;

    try {
      const chat = await Chat.findOne({ _id: chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhóm trò chuyện",
        });
      }
      if (!chat.users.includes(currentUserId)) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền thêm người dùng vào nhóm",
        });
      }
      chat.users = [...chat.users, ...users];
      await chat.save();
      return res.status(200).json({
        success: true,
        message: "Thêm người dùng vào nhóm thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Thêm người dùng vào nhóm không thành công",
      });
    }
  },
};

module.exports = chatController;
