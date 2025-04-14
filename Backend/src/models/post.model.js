import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  content: {
    type: String,
    trim: true, // remove unnecessary text
  },
  media: [
    {
      type: String,
    },
  ],
  hashtags: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // refers to user collections
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
