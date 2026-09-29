import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("EcoVision Express API", () => {
  const app = createApp();

  it("GET /health should return 200 OK and service status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("EcoVision API");
  });

  it("GET /api/analyses without auth should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/analyses");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  it("GET /non-existent-route should return 404 Not Found", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not Found");
  });
});
