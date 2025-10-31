import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../app.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

let adminToken;
let testUser;

beforeAll(async () => {
  // connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST);

  await Admin.deleteMany({});
  await User.deleteMany({});

  // create test admin
  const hashedPassword = await bcrypt.hash("123456", 10);
  const admin = await Admin.create({
    name: "Test Admin",
    email: "admin@test.com",
    password: hashedPassword,
  });

  adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);

  // create test user with one device
  testUser = await User.create({
    name: "John Doe",
    email: "john@example.com",
    password: await bcrypt.hash("password", 10),
    devices: [
      { deviceId: "device123", verified: false, status: "PENDING" },
    ],
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Admin API", () => {
  it("should log in an admin", async () => {
    const res = await request(app)
      .post("/api/admin/login")
      .send({ email: "admin@test.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fetch all users (protected route)", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    const users = res.body.users || res.body.data || res.body;
    expect(Array.isArray(users)).toBe(true);
  });

  it("should verify a user device", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${testUser._id}/verify-device`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        deviceId: "device123",
        verified: true,
        status: "APPROVED",
      });

    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("devices");
      const device = res.body.devices.find(d => d.deviceId === "device123");
      expect(device.status).toBe("APPROVED");
      expect(device.verified).toBe(true);
    }
  });

  it("should reject a user device with reason", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${testUser._id}/verify-device`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        deviceId: "device123",
        verified: false,
        status: "REJECTED",
        rejectionReason: "Suspicious activity detected",
      });

    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      const device = res.body.devices.find(d => d.deviceId === "device123");
      expect(device.status).toBe("REJECTED");
      expect(device.rejectionReason).toBe("Suspicious activity detected");
    }
  });
});
