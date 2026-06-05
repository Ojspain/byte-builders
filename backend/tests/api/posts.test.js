import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Post.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../models/Comment.js", () => ({
  default: {
    find: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock("../../models/SavedPost.js", () => ({
  default: {
    deleteMany: vi.fn(),
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

import app from "../../app.js";
import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import SavedPost from "../../models/SavedPost.js";
import Like from "../../models/Like.js";
import Notification from "../../models/Notification.js";

const makeToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Posts API", () => {
  it("GET /api/posts returns 200 with a posts array", async () => {
    const mockPosts = [
      {
        toObject: () => ({
          _id: "post-1",
          authorId: { _id: "user-1", profilePicUrl: "/one.png" },
          speciesCommon: "Ladybug",
        }),
      },
      {
        toObject: () => ({
          _id: "post-2",
          authorId: { _id: "user-2" },
          speciesCommon: "Moth",
        }),
      },
    ];

    const sort = vi.fn().mockResolvedValue(mockPosts);
    const populate = vi.fn().mockReturnValue({ sort });
    Post.find.mockReturnValue({ populate });

    const response = await request(app).get("/api/posts");

    expect(response.status).toBe(200);
    expect(Post.find).toHaveBeenCalledWith({});
    expect(populate).toHaveBeenCalledWith("authorId", "profilePicUrl");
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(response.body).toEqual([
      {
        _id: "post-1",
        authorId: "user-1",
        authorProfilePicUrl: "/one.png",
        speciesCommon: "Ladybug",
      },
      {
        _id: "post-2",
        authorId: "user-2",
        authorProfilePicUrl: "",
        speciesCommon: "Moth",
      },
    ]);
  });

  it("DELETE /api/posts/:id returns 401 when missing token", async () => {
    const response = await request(app).delete("/api/posts/post-1");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("DELETE /api/posts/:id returns 403 for non-owner", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: { toString: () => "owner-user" },
    });

    const response = await request(app)
      .delete("/api/posts/post-1")
      .set("Authorization", `Bearer ${makeToken("different-user")}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Not authorized to delete this post",
    });
  });

  it("DELETE /api/posts/:id returns 200 for owner", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: { toString: () => "owner-user" },
    });
    Comment.find.mockResolvedValue([{ _id: "comment-1" }, { _id: "comment-2" }]);
    Post.findByIdAndDelete.mockResolvedValue({ _id: "post-1" });
    Comment.deleteMany.mockResolvedValue({ deletedCount: 2 });
    SavedPost.deleteMany.mockResolvedValue({ deletedCount: 1 });
    Like.deleteMany.mockResolvedValue({ deletedCount: 3 });
    Notification.deleteMany.mockResolvedValue({ deletedCount: 3 });

    const response = await request(app)
      .delete("/api/posts/post-1")
      .set("Authorization", `Bearer ${makeToken("owner-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Post deleted" });
    expect(Comment.find).toHaveBeenCalledWith({ postId: "post-1" }, { _id: 1 });
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith("post-1");
    expect(Comment.deleteMany).toHaveBeenCalledWith({ postId: "post-1" });
    expect(SavedPost.deleteMany).toHaveBeenCalledWith({ postId: "post-1" });
    expect(Like.deleteMany).toHaveBeenCalledWith({
      $or: [
        { targetType: "post", targetId: "post-1" },
        { targetType: "comment", targetId: { $in: ["comment-1", "comment-2"] } },
      ],
    });
    expect(Notification.deleteMany).toHaveBeenCalledWith({
      $or: [{ postId: "post-1" }, { commentId: { $in: ["comment-1", "comment-2"] } }],
    });
  });

  it("GET /api/posts/saved returns 401 when missing token", async () => {
    const response = await request(app).get("/api/posts/saved");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("POST /api/posts/:id/save returns 401 when missing token", async () => {
    const response = await request(app).post("/api/posts/post-1/save");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("GET /api/posts/:id/save/me returns 401 when missing token", async () => {
    const response = await request(app).get("/api/posts/post-1/save/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("GET /api/posts/:id returns 404 when post not found", async () => {
    Post.findById.mockResolvedValue(null);

    const response = await request(app).get("/api/posts/post-404");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Post not found" });
  });

  it("GET /api/posts/:id/comments returns 200 with comments array", async () => {
    const sort = vi.fn().mockResolvedValue([]);
    Comment.find.mockReturnValue({ sort });

    const response = await request(app).get("/api/posts/post-1/comments");

    expect(response.status).toBe(200);
    expect(Comment.find).toHaveBeenCalledWith({ postId: "post-1" });
    expect(sort).toHaveBeenCalledWith({ createdAt: 1 });
    expect(response.body).toEqual([]);
  });

  it("POST /api/posts/:id/comments returns 401 when missing token", async () => {
    const response = await request(app)
      .post("/api/posts/post-1/comments")
      .send({ commentText: "Nice post" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("POST /api/posts returns 400 when image is missing", async () => {
    const response = await request(app).post("/api/posts").field("location", "Garden");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Image is required" });
  });
});
