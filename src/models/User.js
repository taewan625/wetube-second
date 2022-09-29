import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false }, // github login 확인여부 -> 이걸로 나중에 profile edit화면 만들기(githubuser는 pw없으므로 필요 없음)
  username: { type: String, required: true, unique: true },
  password: { type: String },
  location: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentModelName" }],
  myVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "VideoModelName" }], // 여러개라서 array
});

// this: userSchema를 의미한다

userSchema.pre("save", async function () {
  // this func중에서 password가 수정이될 때 작동하는 hash * this=UserModel
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const UserModel = mongoose.model("UserModelName", userSchema);

export default UserModel;
