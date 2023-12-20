const Post = require("../models/post.model");
const User = require("../models/user.model");
const { deleteSingleImage, deleteSingleVideo, deleteImages, deleteVideos } = require("../utils/cloudinary");
const postController = {
  createAPost: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "khong tim thay nguoi dung",
        });
      }
      let post = await Post.create({ ...req.body, user: userId });
      post = await Post.findById(post._id)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user likes commentReply",
          },
        });

      res.status(201).json({
        success: true,
        post: post,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "tao bai viet that bai",
      });
    }
  },
  updateAPost: async (req, res) => {
    try {
      const userId = req.userId;
      let { content, listFileDelete, status } = req.body;

      if (listFileDelete) {
        listFileDelete = JSON.parse(listFileDelete);
      } else {
        listFileDelete = [];
      }

      const postId = req.params.id;
      const post = await Post.findById(postId);

      listFileDelete.map(async (item) => {
        if (item.resource_type === "video") {
          await deleteVideos(item.public_id);
        } else {
          await deleteImages(item.public_id);
        }
      });

      const newMedia = post?.media.filter((item) => {
        const idDel = listFileDelete.find((file) => file.public_id === item.public_id);
        if (idDel) {
          return false;
        }
        return true;
      });
      if (post.user.valueOf() === userId) {
        const newPost = await Post.findByIdAndUpdate(
          postId,
          { content, status, media: [...req.media, ...newMedia] },
          { new: true },
        )
          .populate("user")
          .populate({
            path: "comments",
            populate: {
              path: "user likes commentReply",
            },
          });

        if (!newPost) {
          return res.status(404).json({
            success: false,
            message: "update that bai",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "update thanh cong",
            post: newPost,
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "ban khong co quyen sua bai viet",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  deleteAPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const post = await Post.findById(postId);
      if (post.user.valueOf() === userId) {
        await post.deleteOne();
        res.status(200).json({
          success: true,
          message: "xoa bai viet thanh cong",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "ban khong co quyen xoa bai viet nay",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ success: false, message: "ban khong the xoa bai viet nay" });
    }
  },

  getAllUserPosts: async (req, res) => {
    let { page = 1, limit = 4, userId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    try {
      let posts, totalPosts, totalPages;
      if (!userId) {
        posts = await Post.find({ user: req.userId })
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: "desc" })
          .populate({
            path: "comments",
            populate: {
              path: "user likes commentReply",
            },
          });
        totalPosts = await Post.countDocuments({
          user: req.userId,
        });
        totalPages = Math.ceil(totalPosts / limit);
      } else {
        const currentUserId = req.userId;
        const currentUser = await User.findById(currentUserId);
        const isFriend = currentUser.friends.some((friendId) => friendId.valueOf() === userId);

        if (!isFriend) {
          posts = await Post.find({ user: userId, status: "public" })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: "desc" })
            .populate({
              path: "comments",
              populate: {
                path: "user likes commentReply",
              },
            });
          totalPosts = await Post.countDocuments({
            user: userId,
            status: "public",
          });
          totalPages = Math.ceil(totalPosts / limit);
        } else {
          posts = await Post.find({
            user: userId,
            status: {
              $in: ["public", "friend"],
            },
          })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: "desc" })
            .populate({
              path: "comments",
              populate: {
                path: "user likes commentReply",
              },
            });
          totalPosts = await Post.countDocuments({
            user: userId,
            status: {
              $in: ["public", "friend"],
            },
          });
          totalPages = Math.ceil(totalPosts / limit);
        }
      }
      res.status(200).json({
        success: true,
        posts,
        metadata: {
          page,
          limit,
          totalPages,
          total: totalPosts,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra phía máy chủ, Vui lòng thử lại sau",
      });
    }
  },
  getFriendsPost: async (req, res) => {
    let { page = 1, limit = 4 } = req.query;
    const userId = req.userId;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const currentUser = await User.findById(userId);
    let arrayId = [...currentUser?.friends, userId];

    const posts = await Post.find({
      user: { $in: arrayId },
      status: {
        $in: ["public", "friend"],
      },
    })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: "desc" })
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user likes commentReply",
        },
      });

    const totalPosts = await Post.countDocuments({
      user: { $in: arrayId },
      status: {
        $in: ["public", "friend"],
      },
    });
    const totalPages = Math.ceil(totalPosts / limit);
    res.status(200).json({
      success: true,
      posts,
      metadata: {
        page,
        limit,
        totalPages,
        total: totalPosts,
      },
    });
  },
  getAPostById: async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "user likes commentReply",
        },
      })
      .populate("user");
    try {
      if (post) {
        res.status(200).json({
          success: true,
          message: "lấy bài viết ",
          post: post,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: "Loi khi xem bai viet nay",
      });
    }
  },
  uploadMultimediaFiles: async (req, res) => {
    try {
      const { postId } = req.body;
      const listMediaFiles = req.media;

      await Post.findOneAndUpdate({ _id: postId }, { $push: { media: listMediaFiles } });
      return res.status(200).json({
        success: true,
        media: listMediaFiles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tai file media that bai",
      });
    }
  },
  deleteSingleFile: async (req, res) => {
    try {
      const postId = req.params.postId;
      const newArrMedia = req.media;
      const post = await Post.findOneAndUpdate({ _id: postId }, { $push: { media: newArrMedia } }, { new: true });
      await post.save();
      return res.status(200).json({
        success: true,
        media: newArrMedia,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = postController;
