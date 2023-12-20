const cloudinary = require("../utils/cloudinary");
const Post = require("../models/post.model");

const deleteSingleFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    const deleteSingleImage = async (fileId) => await cloudinary.deleteSingleImage(`media/${fileId}`);
    const deleteSingleVideo = async (fileId) => await cloudinary.deleteSingleVideo(`media/${fileId}`);

    post?.media.map(async (item) => {
      if (item.resource_type === "video") {
        await deleteSingleVideo(fileId);
      } else {
        await deleteSingleImage(fileId);
      }
    });

    const arrMedia = post.media.filter((item) => {
      const id = item?.public_id.split("/");
      const pId = id[id.length - 1];
      return pId !== fileId;
    });
    post.media = arrMedia;
    await post.save();
    res.status(200).json({
      success: true,
      media: post?.media,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "khong dung bai post nay",
    });
  }
};

module.exports = deleteSingleFile;
