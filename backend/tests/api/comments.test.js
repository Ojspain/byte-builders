import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Comment.js", () => ({
  default: {
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../models/Like.js", () => ({
  default: {
    deleteMany: vi.fn(),
  },
}));

vi.mock("../../models/Notification.js", () => ({
  default: {
    deleteMany: vi.fn(),
  },
}));

vi.mock("../../models/Post.js", () => ({
  default: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock("../../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

import app from "../../app.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Notification from "../../models/Notification.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";

const makeToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Comments API", () => {
  it("PUT /api/comments/:commentId returns 401 when missing token", async () => {
    const response = await request(app)
      .put("/api/comments/comment-1")
      .send({ commentText: "Updated text" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("PUT /api/comments/:commentId returns 403 for non-owner", async () => {
    Comment.findById.mockResolvedValue({
      _id: "comment-1",
      authorId: "owner-user",
      commentText: "Original",
      save: vi.fn(),
      toObject: () => ({}),
    });

    const response = await request(app)
      .put("/api/comments/comment-1")
      .set("Authorization", `Bearer ${makeToken("different-user")}`)
      .send({ commentText: "Updated text" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Not authorized to edit this comment",
    });
  });

  it("PUT /api/comments/:commentId returns 200 for owner update", async () => {
    const commentDoc = {
      _id: "comment-1",
      authorId: "owner-user",
      postId: "post-1",
      commentText: "Original",
      save: vi.fn().mockResolvedValue(undefined),
      toObject() {
        return {
          _id: this._id,
          authorId: this.authorId,
          postId: this.postId,
          commentText: this.commentText,
        };
      },
    };

    Comment.findById.mockResolvedValue(commentDoc);
    User.findById.mockResolvedValue({
      _id: "owner-user",
      username: "owner",
      profilePicUrl: "/avatar.png",
    });

    const response = await request(app)
      .put("/api/comments/comment-1")
      .set("Authorization", `Bearer ${makeToken("owner-user")}`)
      .send({ commentText: "Updated text" });

    expect(response.status).toBe(200);
    expect(commentDoc.save).toHaveBeenCalledTimes(1);
    expect(User.findById).toHaveBeenCalledTimes(1);
    expect(response.body.comment.commentText).toBe("Updated text");
    expect(response.body.comment.author).toEqual({
      _id: "owner-user",
      username: "owner",
      profilePicUrl: "/avatar.png",
    });
  });

  it("DELETE /api/comments/:commentId returns 200 for owner delete", async () => {
    Comment.findById.mockResolvedValue({
      _id: "comment-1",
      authorId: "owner-user",
      postId: "post-1",
    });
    Comment.findByIdAndDelete.mockResolvedValue({ _id: "comment-1" });
    Post.findOneAndUpdate.mockResolvedValue({});
    Like.deleteMany.mockResolvedValue({ deletedCount: 0 });
    Notification.deleteMany.mockResolvedValue({ deletedCount: 0 });

    const response = await request(app)
      .delete("/api/comments/comment-1")
      .set("Authorization", `Bearer ${makeToken("owner-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Comment deleted" });
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith("comment-1");
    expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "post-1", commentCount: { $gt: 0 } },
      { $inc: { commentCount: -1 } },
    );
    expect(Like.deleteMany).toHaveBeenCalledWith({
      targetType: "comment",
      targetId: "comment-1",
    });
    expect(Notification.deleteMany).toHaveBeenCalledWith({
      commentId: "comment-1",
    });
  });
});
