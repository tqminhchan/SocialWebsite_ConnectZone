const Notification = require("../models/notification.model");

const notificationController = {
  createNotification: async (req, res, next) => {
    const userId = req.userId;
    const { content, type, user, sender } = req.body;

    try {
      const notification = await Notification.create({ content: content, type: type, user: user, sender: sender });

      res.status(200).json({
        success: true,
        message: "Tạo thông báo thành công",
        notification: notification,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tạo thông báo thất bại",
      });
    }
  },
  getAllNotifications: async (req, res) => {
    const userId = req.userId;

    try {
      const notifications = await Notification.find({ user: userId })
        .populate("user")
        .populate("sender")
        .sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: "Lấy thông báo thành công",
        notifications: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lấy thông báo thất bại",
      });
    }
  },
  readNotification: async (req, res) => {
    const { notificationId } = req.body;
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(400).json({
          success: false,
          message: "Thông báo không tồn tại",
        });
      }
      notification.status = "read";
      await notification.save();

      res.status(200).json({
        success: true,
        message: "Đọc thông báo thành công",
        notification: notification,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đọc thông báo thất bại",
      });
    }
  },
};
module.exports = notificationController;
