import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, reqauired: true, unique: true },
  password: { type: String },
  avatarUrl: { type: String, default: "" },
  socialOnly: { type: Boolean, default: false },
  name: { type: String, requried: true },
  location: String,
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});
const User = mongoose.model("User", userSchema);
export default User;
