const cloudinary = require("../utils/cloudinary");

const uploadMediaFiles = async (req, res, next) => {
  let folder = "media";
  if (req.body.folder) folder = req.body.folder;
  const uploader = async (file, folderStorage) => await cloudinary.uploadMedia(res, file, folderStorage);
  const mediaFiles = [];
  const files = req.files || [];

  for (const file of files) {
    if (folder === "chat") {
      if (file.mimetype.includes("video")) {
        folder = "chat/video";
      } else {
        folder = "chat/image";
      }
    }
    const newFile = await uploader(file, folder);
    mediaFiles.push(newFile);
  }
  req.media = mediaFiles;
  next();
};
module.exports = uploadMediaFiles;
