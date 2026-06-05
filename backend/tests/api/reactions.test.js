import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Like.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../../models/Post.js", () => ({
  default: {
    findById: vi.fn(),
    updateOne: vi.fn(),
  },
}));

vi.mock("../../models/Comment.js", () => ({
  default: {
    findById: vi.fn(),
    updateOne: vi.fn(),
  },
}));

vi.mock("../../models/Species.js", () => ({
  default: {
    findById: vi.fn(),
    updateOne: vi.fn(),
  },
}));

vi.mock("../../models/Notification.js", () => ({
  default: {
    create: vi.fn(),
  },
}));

import app from "../../app.js";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import Notification from "../../models/Notification.js";

const makeToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Reactions API", () => {
  it("PUT /api/reactions/:targetType/:targetId returns 401 when missing token", async () => {
    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .send({ reactionType: "like" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("PUT /api/reactions/:targetType/:targetId returns 400 for invalid target type", async () => {
    const response = await request(app)
      .put("/api/reactions/badtype/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "like" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid target type" });
  });

  it("PUT /api/reactions/:targetType/:targetId returns 400 for invalid reaction type", async () => {
    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "hug" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid reaction type" });
  });

  it("PUT /api/reactions/:targetType/:targetId returns 404 when target is missing", async () => {
    Post.findById.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "like" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Target not found" });
  });

  it("PUT /api/reactions/:targetType/:targetId returns existing reaction payload with no-op", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: "post-owner",
      likeCount: 3,
      sprayCount: 1,
    });
    Like.findOne.mockResolvedValue({ reactionType: "like" });

    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "like" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        targetType: "post",
        targetId: "post-1",
        myReaction: "like",
        likeCount: 3,
        sprayCount: 1,
      },
    });
    expect(Post.updateOne).not.toHaveBeenCalled();
    expect(Like.create).not.toHaveBeenCalled();
  });

  it("PUT /api/reactions/:targetType/:targetId creates reaction and notification for non-owner", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: "post-owner",
      likeCount: 0,
      sprayCount: 0,
    });
    Like.findOne.mockResolvedValue(null);
    Like.create.mockResolvedValue({});
    Post.updateOne.mockResolvedValue({});
    Notification.create.mockResolvedValue({});

    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "like" });

    expect(response.status).toBe(200);
    expect(Post.updateOne).toHaveBeenCalledWith(
      { _id: "post-1" },
      { $inc: { likeCount: 1 } },
    );
    expect(Notification.create).toHaveBeenCalledWith({
      recipientId: "post-owner",
      actorId: "viewer-user",
      type: "like",
      postId: "post-1",
      commentId: null,
    });
    expect(response.body).toEqual({
      data: {
        targetType: "post",
        targetId: "post-1",
        myReaction: "like",
        likeCount: 1,
        sprayCount: 0,
      },
    });
  });

  it("PUT /api/reactions/:targetType/:targetId does not notify for spray reactions", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: "post-owner",
      likeCount: 0,
      sprayCount: 2,
    });
    Like.findOne.mockResolvedValue(null);
    Like.create.mockResolvedValue({});
    Post.updateOne.mockResolvedValue({});

    const response = await request(app)
      .put("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`)
      .send({ reactionType: "spray" });

    expect(response.status).toBe(200);
    expect(Post.updateOne).toHaveBeenCalledWith(
      { _id: "post-1" },
      { $inc: { sprayCount: 1 } },
    );
    expect(Notification.create).not.toHaveBeenCalled();
    expect(response.body.data).toMatchObject({
      targetType: "post",
      targetId: "post-1",
      myReaction: "spray",
      likeCount: 0,
      sprayCount: 3,
    });
  });

  it("DELETE /api/reactions/:targetType/:targetId returns 400 for invalid target type", async () => {
    const response = await request(app)
      .delete("/api/reactions/notreal/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid target type" });
  });

  it("DELETE /api/reactions/:targetType/:targetId returns 404 when target is missing", async () => {
    Post.findById.mockResolvedValue(null);

    const response = await request(app)
      .delete("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Target not found" });
  });

  it("DELETE /api/reactions/:targetType/:targetId removes reaction and decrements count", async () => {
    Post.findById.mockResolvedValue({
      _id: "post-1",
      authorId: "post-owner",
      likeCount: 2,
      sprayCount: 1,
    });
    Like.findOneAndDelete.mockResolvedValue({ reactionType: "like" });
    Post.updateOne.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/reactions/post/post-1")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(Post.updateOne).toHaveBeenCalledWith(
      { _id: "post-1" },
      { $inc: { likeCount: -1 } },
    );
    expect(response.body).toEqual({
      data: {
        targetType: "post",
        targetId: "post-1",
        myReaction: null,
        likeCount: 1,
        sprayCount: 1,
      },
    });
  });

  it("GET /api/reactions/:targetType/:targetId/me returns 200 with null when no reaction", async () => {
    Like.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/reactions/post/post-1/me")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        targetType: "post",
        targetId: "post-1",
        myReaction: null,
      },
    });
  });
});
