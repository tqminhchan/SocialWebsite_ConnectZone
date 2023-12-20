const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilterMedia = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4|MPEG-4|mkv)$/)) {
    cb(new Error("Định dạng file này không được hỗ trợ!"), false);
  } else {
    cb(null, true);
  }
};

const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 20000000,
  },
  fileFilterMedia,
});
module.exports = { uploadMedia };
