const cloudinary = require("../utils/cloudinary");
const Post = require("../models/post.model");

const deleteMediaFiles = async (req, res) => {
  try {
    const { postId } = req.query;
    const post = await Post.findById(postId);
    const deleteFileImages = async (public_id) => await cloudinary.deleteImages(public_id);
    const deleteFileVideos = async (public_id) => await cloudinary.deleteVideos(public_id);
    post?.media.map(async (item) => {
      const id = item?.public_id;
      if (item.resource_type === "video") {
        await deleteFileVideos(id);
      } else {
        await deleteFileImages(id);
      }
    });

    res.status(200).json({
      success: true,
      message: "xoa anh thanh cong",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Xoa anh that bai",
    });
  }
};

module.exports = deleteMediaFiles;
