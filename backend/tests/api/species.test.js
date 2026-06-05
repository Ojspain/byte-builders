import request from "supertest";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../models/Species.js", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
  },
}));

import app from "../../app.js";
import Species from "../../models/Species.js";

describe("Species API", () => {
  it("GET /api/species returns 200 and full array when no search", async () => {
    const mockSpecies = [{ _id: "sp-1" }, { _id: "sp-2" }];
    const limit = vi.fn().mockResolvedValue(mockSpecies);
    Species.find.mockReturnValue({ limit });

    const response = await request(app).get("/api/species");

    expect(response.status).toBe(200);
    expect(Species.find).toHaveBeenCalledWith({});
    expect(limit).toHaveBeenCalledWith(0);
    expect(response.body).toEqual(mockSpecies);
  });

  it("GET /api/species?search=lady returns 200 and filtered array", async () => {
    const mockSpecies = [{ _id: "sp-1", speciesCommon: "Ladybug" }];
    const limit = vi.fn().mockResolvedValue(mockSpecies);
    Species.find.mockReturnValue({ limit });

    const response = await request(app).get("/api/species?search=lady");

    expect(response.status).toBe(200);
    expect(Species.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.any(Array),
      }),
    );
    expect(limit).toHaveBeenCalledWith(20);
    expect(response.body).toEqual(mockSpecies);
  });

  it("GET /api/species/name/:name returns 404 when species is missing", async () => {
    Species.findOne.mockResolvedValue(null);

    const response = await request(app).get("/api/species/name/unknown-species");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Species not found" });
  });

  it("GET /api/species/:id returns 500 on model error", async () => {
    Species.findById.mockRejectedValue(new Error("boom"));

    const response = await request(app).get("/api/species/abc123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Server Error" });
  });
});
