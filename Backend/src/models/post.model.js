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
});

const Post = mongoose.model("Post", postSchema);
export default Post;
