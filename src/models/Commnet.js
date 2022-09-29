import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserModelName",
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "VideoModelName",
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const CommentModel = mongoose.model("CommentModelName", commentSchema);

export default CommentModel;
