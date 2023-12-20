const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = require("./cloudinaryConfig");

cloudinary.config(cloudinaryConfig);

exports.uploadImage = async (res, file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
      public_id: `${Date.now()}`,
    });
    const image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    return image;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tải thất bại",
    });
  }
};
exports.uploadVideo = async (res, file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "video",
      public_id: `${Date.now()}`,
      chunk_size: 6000000,
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" },
      ],
      eager_async: true,
    });
    const video = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    return video;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tải thất bại",
    });
  }
};
exports.uploadMedia = async (res, file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file?.path, {
      folder,
      resource_type: "auto",
      public_id: `${Date.now()}`,
    });
    const mediaFiles = {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
    return mediaFiles;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Tải thất bại hahah",
    });
  }
};

exports.deleteImages = async (public_id, res) => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(public_id);
    return result;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xoa anh that bai",
    });
  }
};

exports.deleteVideos = async (public_id, res) => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(public_id, { resource_type: "video" });
    return result;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Xoa anh that bai",
    });
  }
};

exports.deleteSingleImage = async (public_id, res) => {
  try {
    const id = public_id.split("/");
    const pId = id[id.length - 1];
    const result = await cloudinary.uploader.destroy(pId);
    return result;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xoa anh that bai",
    });
  }
};
exports.deleteSingleVideo = async (public_id, res) => {
  try {
    const id = public_id.split("/");
    const pId = id[id.length - 1];
    const result = await cloudinary.uploader.destroy(pId, { resource_type: "video" });
    return result;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Xoa anh that bai",
    });
  }
};
