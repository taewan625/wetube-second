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
});

// this: userSchema를 의미한다

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const UserModel = mongoose.model("UserModelForConnectVideoModel", userSchema);

export default UserModel;
