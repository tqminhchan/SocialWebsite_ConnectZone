const mongoose = require("mongoose");
const Hobby = require("../models/hobby.model");
const User = require("../models/user.model");
const hobbyController = {
  getAllHobbies: async (req, res, next) => {
    try {
      const hobbies = await Hobby.find();
      res.status(200).json({
        success: true,
        hobbies: hobbies,
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateHobbiesUser: async (req, res, next) => {
    try {
      const userId = req.userId;
      const newHobbies = req.body;
      const user = await User.findOneAndUpdate({ _id: userId }, { hobbies: newHobbies }, { new: true }).populate(
        "hobbies",
      );
      await user.save();
      res.status(200).json({
        success: true,
        hobbies: user?.hobbies,
        message: "cap nhat so thich thanh cong",
      });
    } catch (error) {
      console.log(error);
    }
  },
  getListHobbyUser: async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người dùng",
      });
    }
    try {
      const user = await User.findById(userId).populate("hobbies");
      res.status(200).json({
        success: true,
        hobbies: user?.hobbies,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lấy thông tin hobby thất bại",
      });
    }
  },
};
module.exports = hobbyController;
