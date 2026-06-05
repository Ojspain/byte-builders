import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Follow.js", () => ({
  default: {
    create: vi.fn(),
    countDocuments: vi.fn(),
    find: vi.fn(),
    exists: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("../../models/Notification.js", () => ({
  default: {
    create: vi.fn(),
  },
}));

import app from "../../app.js";
import Follow from "../../models/Follow.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";

const makeToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Follows API", () => {
  it("POST /api/users/:username/follow returns 400 when user follows self", async () => {
    User.findOne.mockResolvedValue({ _id: "same-user", username: "target" });

    const response = await request(app)
      .post("/api/users/target/follow")
      .set("Authorization", `Bearer ${makeToken("same-user")}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "You cannot follow yourself" });
  });

  it("POST /api/users/:username/follow returns 200 already following on duplicate", async () => {
    User.findOne.mockResolvedValue({ _id: "target-user", username: "target" });
    Follow.create.mockRejectedValue({ code: 11000 });
    Follow.countDocuments
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(3);

    const response = await request(app)
      .post("/api/users/target/follow")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Already following user",
      data: {
        targetUsername: "target",
        isFollowing: true,
        targetFollowerCount: 7,
        viewerFollowingCount: 3,
      },
    });
    expect(Notification.create).not.toHaveBeenCalled();
  });

  it("GET /api/users/:username/followers with oversized limit uses capped pagination", async () => {
    User.findOne.mockResolvedValue({ _id: "target-user" });
    const follows = [
      {
        _id: "follow-1",
        createdAt: "2026-06-04T00:00:00.000Z",
        followerId: {
          _id: "follower-1",
          username: "alice",
          profilePicUrl: "/alice.png",
          bio: "hello",
        },
      },
    ];
    const populate = vi.fn().mockResolvedValue(follows);
    const limit = vi.fn().mockReturnValue({ populate });
    const sort = vi.fn().mockReturnValue({ limit });
    Follow.find.mockReturnValue({ sort });

    const response = await request(app).get("/api/users/target/followers?limit=999");

    expect(response.status).toBe(200);
    expect(limit).toHaveBeenCalledWith(50);
    expect(response.body.data.nextCursor).toBeNull();
    expect(response.body.data.items).toHaveLength(1);
  });

  it("GET /api/users/:username/follow-status returns 200 with isFollowing false", async () => {
    User.findOne.mockResolvedValue({ _id: "target-user", username: "target" });
    Follow.exists.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/users/target/follow-status")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        targetUsername: "target",
        isFollowing: false,
      },
    });
  });

  it("DELETE /api/users/:username/follow returns 200 on unfollow", async () => {
    User.findOne.mockResolvedValue({ _id: "target-user", username: "target" });
    Follow.findOneAndDelete.mockResolvedValue({ _id: "follow-1" });
    Follow.countDocuments
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(2);

    const response = await request(app)
      .delete("/api/users/target/follow")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Unfollowed user",
      data: {
        targetUsername: "target",
        isFollowing: false,
        targetFollowerCount: 4,
        viewerFollowingCount: 2,
      },
    });
  });

  it("GET /api/users/:username/following returns 200 with paginated items", async () => {
    User.findOne.mockResolvedValue({ _id: "target-user" });
    const follows = [
      {
        _id: "follow-2",
        createdAt: "2026-06-04T00:00:00.000Z",
        followeeId: {
          _id: "followee-1",
          username: "bob",
          profilePicUrl: "/bob.png",
          bio: "bio",
        },
      },
    ];
    const populate = vi.fn().mockResolvedValue(follows);
    const limit = vi.fn().mockReturnValue({ populate });
    const sort = vi.fn().mockReturnValue({ limit });
    Follow.find.mockReturnValue({ sort });

    const response = await request(app).get("/api/users/target/following?limit=20");

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0]).toMatchObject({
      _id: "follow-2",
      user: {
        _id: "followee-1",
        username: "bob",
      },
    });
  });
});
