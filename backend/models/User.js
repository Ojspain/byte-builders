import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "", maxlength: 300 },
    profilePicUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ username: "text" });

const User = mongoose.model("User", userSchema);

export default User;
