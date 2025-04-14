import Review from "../models/reviews.model.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import httpStatus from "http-status";

class reviewsPost {
  postReviews = wrapAsync(async (req, res, next) => {
    const { comment, likes } = req.body;
    const likedByUser = req.user?._id;

    if (!comment && !likes) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Comment something first!" });
    }

    const newReview = new Review({
      likes: likes || 0,
      comment: comment,
      likedBy: likedByUser ? likedByUser : [],
    });

    await newReview.save();

    const populateReview = await Review.findById(newReview._id).populate(
      "likedBy",
      "name username identifier"
    );

    return res
      .json(httpStatus.CREATED)
      .json({ message: "New Review successfully created", populateReview });
  });
}

export default reviewsPost;
