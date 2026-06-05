import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Notification.js", () => ({
  default: {
    countDocuments: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
  },
}));

import app from "../../app.js";
import Notification from "../../models/Notification.js";

const makeToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Notifications API", () => {
  it("GET /api/notifications returns 401 when token is missing", async () => {
    const response = await request(app).get("/api/notifications");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Missing or invalid token" });
  });

  it("GET /api/notifications/unread returns 200 with count", async () => {
    Notification.countDocuments.mockResolvedValue(5);

    const response = await request(app)
      .get("/api/notifications/unread")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ count: 5 });
    expect(Notification.countDocuments).toHaveBeenCalledWith({
      recipientId: "viewer-user",
      read: false,
    });
  });

  it("PUT /api/notifications/:notificationId/read returns 404 when not found", async () => {
    Notification.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/notifications/notif-1/read")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Notification not found" });
  });

  it("DELETE /api/notifications/clear-all returns 200 with success message", async () => {
    Notification.deleteMany.mockResolvedValue({ deletedCount: 3 });

    const response = await request(app)
      .delete("/api/notifications/clear-all")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "All notifications deleted" });
    expect(Notification.deleteMany).toHaveBeenCalledWith({
      recipientId: "viewer-user",
    });
  });

  it("PUT /api/notifications/mark-all-read returns 200 with success message", async () => {
    Notification.updateMany.mockResolvedValue({ modifiedCount: 2 });

    const response = await request(app)
      .put("/api/notifications/mark-all-read")
      .set("Authorization", `Bearer ${makeToken("viewer-user")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "All notifications marked as read" });
    expect(Notification.updateMany).toHaveBeenCalledWith(
      { recipientId: "viewer-user", read: false },
      { read: true },
    );
  });
});
