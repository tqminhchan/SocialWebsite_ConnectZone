const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const cloudinary = require("../utils/cloudinary");

const commentController = {
  createComment: async (req, res) => {
    const { postId, content, commentParentId, media } = req.body;
    const userId = req.userId;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bình luận",
      });
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết",
        });
      }
      let comment;

      if (commentParentId) {
        comment = await Comment.create({
          user: userId,
          content,
          post: postId,
          commentParent: commentParentId,
          media: media,
        });
        const commentParent = await Comment.findById(commentParentId);
        if (!commentParent) {
          return res.status(404).json({
            success: false,
            message: "Tạo bình luận thất bại",
          });
        }
        commentParent.commentReply.push(comment._id);
        await commentParent.save();
      } else {
        comment = await Comment.create({
          user: userId,
          content,
          post: postId,
          media: media,
        });
      }
      post.comments.push(comment._id);
      await post.save();
      comment = await comment.populate({
        path: "user likes commentReply",
      });
      return res.status(200).json({
        success: true,
        message: "Tạo bình luận thành công",
        comment,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Tạo bình luận thất bại",
      });
    }
  },
  uploadMultimediaFiles: async (req, res) => {
    try {
      const { commentId } = req.body;
      const listMediaFiles = req.media;

      await Comment.findOneAndUpdate({ _id: commentId }, { $push: { media: listMediaFiles } });
      return res.status(200).json({
        success: true,
        media: listMediaFiles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Tải file media thất bại",
      });
    }
  },

  getCommentById: async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId).populate({
        path: "user likes commentReply",
      });
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bình luận",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Lấy bình luận thành công",
        comment,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lấy bình luận thất bại",
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const userId = req.userId;
      let { content, listFileDelete } = req.body;
      if (listFileDelete) {
        listFileDelete = JSON.parse(listFileDelete);
      } else {
        listFileDelete = [];
      }

      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);

      listFileDelete.map(async (item) => {
        if (item.resource_type === "video") {
          await deleteVideos(item.public_id);
        } else {
          await deleteImages(item.public_id);
        }
      });

      const newMedia = comment?.media.filter((item) => {
        const idDel = listFileDelete.find((file) => file.public_id === item.public_id);
        if (idDel) {
          return false;
        }
        return true;
      });
      if (comment.user.valueOf() === userId) {
        const newComment = await Comment.findByIdAndUpdate(
          commentId,
          { content, media: [...req.media, ...newMedia] },
          { new: true },
        );
        if (!newComment) {
          return res.status(404).json({
            success: false,
            message: "Chỉnh sửa bình luận thất bại",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Chỉnh sửa bình luận thành công",
            comment: newComment,
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Bạn không có quyền chỉnh sửa bình luận này",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Chỉnh sửa bình luận thất bại",
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.userId;
      const comment = await Comment.findById(commentId);
      if (comment.user.valueOf() === userId) {
        await comment.deleteOne();
        await Post.findOneAndUpdate({ _id: comment.post }, { $pull: { comments: commentId } });
        res.status(200).json({
          success: true,
          message: "Xóa bình luận thành công",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Bạn không có quyền xóa bình luận này",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Xóa bình luận thất bại",
      });
    }
  },
  deleteMediaFiles: async (req, res) => {
    try {
      const { commentId } = req.query;
      const comment = await Comment.findById(commentId);
      const deleteFileImages = async (public_id) => await cloudinary.deleteImages(public_id);
      const deleteFileVideos = async (public_id) => await cloudinary.deleteVideos(public_id);
      comment?.media.map(async (item) => {
        const id = item?.public_id;
        if (item.resource_type === "video") {
          await deleteFileVideos(id);
        } else {
          await deleteFileImages(id);
        }
      });

      res.status(200).json({
        success: true,
        message: "Xóa media của comment thành công",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Xóa media của comment thất bại",
      });
    }
  },
};

module.exports = commentController;
