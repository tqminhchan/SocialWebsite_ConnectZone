const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const messageController = {
  getMessagesByChatId: async (req, res) => {
    let { page = 1, limit = 20, chatId } = req.query;
    try {
      page = Number(page);
      limit = Number(limit);
      const skip = (page - 1) * limit;

      const messages = await Message.find({
        chat: chatId,
      })
        .populate("sender", "-password")
        .populate("readBy")
        .populate("chat")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      if (messages.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Đoạn chat chưa có tin nhắn nào",
        });
      }

      const totalMessages = await Message.countDocuments({
        chat: chatId,
      });
      const totalPages = Math.ceil(totalMessages / limit);

      return res.status(200).json({
        success: true,
        metadata: {
          page,
          limit,
          totalPages,
          total: totalMessages,
        },
        messages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lấy danh sách tin nhắn thất bại",
      });
    }
  },
  createMessage: async (req, res) => {
    const { chatId, message, media } = req.body;
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin tin nhắn",
      });
    }

    let content = [];
    if (message) {
      content.push(message);
    }

    if (media) {
      content = [...content, ...media];
    }
    const sender = req.userId;
    try {
      const sendMsg = await Message.create({
        chat: chatId,
        sender,
        content,
      });
      const message = await Message.findOne({ _id: sendMsg?.id })
        .populate("sender", "-password")
        .populate("readBy")
        .populate("chat");

      await Chat.findOneAndUpdate({ _id: chatId }, { latestMessage: message.id });

      return res.status(200).json({
        success: true,
        message: "Gửi tin nhắn thành công",
        message,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Gửi tin nhắn thất bại",
      });
    }
  },
  deleteMessageById: async (req, res) => {
    const { id } = req.params;
    try {
      const message = await Message.findOne({
        _id: id,
      });
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tin nhắn",
        });
      }
      if (message.sender.valueOf() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền thu hồi tin nhắn này",
        });
      }

      message.status = "deleted";
      await message.save();

      return res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tin nhắn được thu hồi thất bại",
      });
    }
  },
};

module.exports = messageController;
