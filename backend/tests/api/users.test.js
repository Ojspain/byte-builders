import request from "supertest";
import bcrypt from "bcryptjs";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../models/Follow.js", () => ({
  default: {
    countDocuments: vi.fn(),
  },
}));

import app from "../../app.js";
import User from "../../models/User.js";
import Follow from "../../models/Follow.js";

describe("Users API", () => {
  it("POST /api/users/signup returns 201 for valid payload", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "user-1",
      username: "testuser",
      email: "test@example.com",
      bio: "",
      profilePicUrl: "",
      createdAt: "2026-06-04T00:00:00.000Z",
      updatedAt: "2026-06-04T00:00:00.000Z",
    });
    Follow.countDocuments.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

    const response = await request(app).post("/api/users/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      _id: "user-1",
      username: "testuser",
      email: "test@example.com",
      followerCount: 0,
      followingCount: 0,
    });
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "testuser",
        email: "test@example.com",
        passwordHash: expect.any(String),
      }),
    );
  });

  it("POST /api/users/signup returns 400 for duplicate username/email", async () => {
    User.findOne.mockResolvedValue({ _id: "existing-user" });

    const response = await request(app).post("/api/users/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Username or email already in use",
    });
    expect(User.create).not.toHaveBeenCalled();
  });

  it("POST /api/users/login returns 200 for valid credentials", async () => {
    const passwordHash = await bcrypt.hash("password123", 12);
    User.findOne.mockResolvedValue({
      _id: "user-1",
      username: "testuser",
      email: "test@example.com",
      passwordHash,
      bio: "",
      profilePicUrl: "",
      createdAt: "2026-06-04T00:00:00.000Z",
      updatedAt: "2026-06-04T00:00:00.000Z",
    });
    Follow.countDocuments.mockResolvedValueOnce(2).mockResolvedValueOnce(3);

    const response = await request(app).post("/api/users/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      _id: "user-1",
      username: "testuser",
      email: "test@example.com",
      followerCount: 2,
      followingCount: 3,
    });
  });

  it("POST /api/users/login returns 401 for invalid credentials", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/api/users/login").send({
      username: "testuser",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
  });
});
