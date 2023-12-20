const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const authController = {
  handleLogin: async (req, res) => {
    const { email, password } = req.body;

    const errorMessages = [];
    if (!email) {
      errorMessages.push({
        email: "Email không được để trống",
      });
    }

    if (!password) {
      errorMessages.push({
        password: "Mật khẩu không được để trống",
      });
    }

    if (password.length < 8) {
      errorMessages.push({
        password: "Mật khẩu phải có tối thiểu 8 kí tự",
      });
    }

    if (errorMessages.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Đăng nhập không thành công",
        errors: errorMessages,
      });
    }

    try {
      const user = await User.findOne({ email })
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        accessToken: generateToken(user),
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ, Vui lòng thử lại!",
      });
    }
  },
  handleRegister: async (req, res) => {
    const { email, password, fullName, dateOfBirth, gender } = req.body;
    const saltRounds = 10;

    const errorMessages = [];

    if (!email) {
      errorMessages.push({
        email: "Email không được để trống",
      });
    }

    if (!password) {
      errorMessages.push({
        password: {
          messages: ["Mật khẩu không được để trống"],
        },
      });
    }

    if (!fullName) {
      errorMessages.push({
        fullName: "Tên đầy đủ không được để trống",
      });
    }
    if (!dateOfBirth) {
      errorMessages.push({
        dateOfBirth: "Ngày sinh không được để trống",
      });
    }
    if (!gender) {
      errorMessages.push({
        gender: "Giới tính không được để trống",
      });
    }
    if (password.length < 8) {
      if (errorMessages.password) {
        errorMessages.push({
          password: {
            messages: [...errorMessages.password.messages, "Mật khẩu phải có tối thiểu 8 kí tự"],
          },
        });
      } else {
        errorMessages.push({
          password: {
            messages: ["Mật khẩu phải có tối thiểu 8 kí tự"],
          },
        });
      }
    }

    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại" });
      }

      const hashPassword = await bcrypt.hash(password, saltRounds);

      let avatar =
        gender === "male"
          ? {
              url: "https://res.cloudinary.com/dgfzdas2h/image/upload/v1685729806/media/male_hxa9wh.png",
              public_id: "female_dr8tzp",
            }
          : {
              url: "https://res.cloudinary.com/dgfzdas2h/image/upload/v1685729807/media/female_dr8tzp.jpg",
              public_id: "male_hxa9wh",
            };

      let newUser = await User.create({
        email,
        password: hashPassword,
        fullName,
        dateOfBirth,
        gender,
        avatar,
      });

      newUser = await User.findById(newUser._id)
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");

      if (!newUser) {
        return res.status(400).json({
          success: false,
          message: "Tạo tài khoản không thành công",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tạo tài khoản thành công",
        accessToken: generateToken(newUser),
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ, Vui lòng thử lại!",
      });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findOne({
        _id: req.userId,
      })
        .select("-password")
        .populate("friends", "_id fullName avatar createdAt gender friends")
        .populate("friendRequests", "_id fullName avatar createdAt gender friends")
        .populate("friendRequestsSent", "_id fullName avatar createdAt gender friends");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng!",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.json(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ, Vui lòng thử lại!",
      });
    }
  },
};

module.exports = authController;
