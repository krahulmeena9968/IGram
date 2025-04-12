import Post from "../models/post.model.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import httpStatus from "http-status";

class crudOperation {
  postData = wrapAsync(async (req, res, next) => {
    const { content, media, hashtags, createdAt, isEdited } = req.body;
    const userId = req.user._id;
    const postByUser = req.user;

    if (!content && (!media || media.length == 0)) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Post must have either text or media" });
    }

    // Ensure media is an array
    if (!Array.isArray(media)) {
      media = [];
    }
    const newPost = new Post({
      content,
      media,
      hashtags,
      createdAt,
      isEdited,
      createdBy: postByUser,
    });
    await newPost.save();

    //Populate the post
    const populatePost = await Post.findById(newPost._id).populate(
      "createdBy",
      "name username, identifier"
    );
    res
      .status(httpStatus.CREATED)
      .json({ message: "New post successfully created!", populatePost });
  });

  editPost = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const editedPost = await Post.findByIdAndUpdate(id, { ...req.body });
    if (!editedPost) {
      res
        .status(httpStatus.NOT_MODIFIED)
        .json({ message: "Post did not edit something went wrong" });
    }
    await editedPost.save();
    res.status(httpStatus.OK).json({ message: "Post edited successfully!" });
  });

  deletePost = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Such post does not exist to delete" });
    }
    res.status(httpStatus.OK).json({ message: "Post deleted successfully" });
  });

  // const getPost = wrapAsync(async (req, res) => {
  //   const { id } = req.params;
  //   const yourPost = await Post.findById(id);
  //   if (!yourPost) {
  //     res.status(httpStatus.NOT_FOUND).json({ message: "Post did not found" });
  //   }
  //   res.status(httpStatus.OK).json(yourPost);
  // });

  allPost = wrapAsync(async (req, res, next) => {
    const allYourPost = await Post.find()
      .populate("createdBy", "name username identifier")
      .sort({ createdAt: -1 });
    if (!allYourPost) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "All the post did not found" });
    }
    res.status(httpStatus.OK).json(allYourPost);
  });
}
export default crudOperation;
