import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    likes: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
