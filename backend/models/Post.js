import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species", default: null },
    speciesCommon: { type: String, default: "" },
    speciesActual: { type: String, default: "" },
    textContent: { type: String, default: "", maxlength: 2000 },
    location: { type: String, default: "" },
    tags: { type: [String], default: [] },
    rating: { type: Number, min: 1, max: 5, required: true },
    heart: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    sprayCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ speciesId: 1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
