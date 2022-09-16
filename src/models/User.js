import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
});

// this: userSchema를 의미한다

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;