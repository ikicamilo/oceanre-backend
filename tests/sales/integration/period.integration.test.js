const request = require("supertest");
const app = require("../../../server");
const { sequelize } = require("../../../src/config/database");
const { User } = require("../../../src/models"); // adjust path if needed
const bcrypt = require("bcryptjs");

describe("GET /api/accounting/periods (authenticated)", () => {
  let token;

  beforeAll(async () => {
    console.log("🧪 Running Period integration test...");
    await sequelize.authenticate();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.drop(); // Drops all tables
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    await sequelize.sync(); // Recreate all tables

    // 1️⃣ Seed a user that can log in
    const passwordHash = await bcrypt.hash("mypassword", 10);
    
    await User.create({
      email: "camilo@example.com",
      password_hash: passwordHash,
      name: "Camilo Barrantes",
      role: "ADMIN"
    });

    // 2️⃣ Log in to get a real JWT
    const resLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "camilo@example.com",
        password: "mypassword",
      });

    expect(resLogin.statusCode).toBe(200);
    token = resLogin.body.token || resLogin.body.access_token;
    expect(token).toBeTruthy();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should return all periods when authenticated", async () => {
    const res = await request(app)
      .get("/api/accounting/periods")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
