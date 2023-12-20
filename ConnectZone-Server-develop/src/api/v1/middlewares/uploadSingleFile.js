const cloudinary = require("../utils/cloudinary");

const uploadSingleFile = {
  uploadSingleFileAvatar: async (req, res, next) => {
    const uploader = async (file) => await cloudinary.uploadImage(res, file, "media");
    const file = req.file;
    const newFile = await uploader(file);
    req.avatar = newFile;
    next();
  },
  uploadSingleFileBackground: async (req, res, next) => {
    const uploader = async (file) => await cloudinary.uploadImage(res, file, "media");

    const file = req.file;
    const newFile = await uploader(file);
    req.background = newFile;
    next();
  },
  uploadSingleFileChat: async (req, res) => {
    try {
      const uploader = async (file, folder) => await cloudinary.uploadMedia(res, file, folder);

      const file = req.file;
      let folder = "";
      if (file?.mimetype.includes("video")) {
        folder = "chat/video";
      } else {
        folder = "chat/image";
      }
      const newFile = await uploader(file, folder);

      res.status(200).json({
        success: true,
        singleMedia: newFile,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: "loi khi tai anh len",
      });
    }
  },
};

module.exports = uploadSingleFile;
