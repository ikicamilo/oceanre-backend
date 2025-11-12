// tests/sales/integration/receipt.integration.test.js
const request = require("supertest");
const app = require("../../../server");
const { sequelize, Receipt, Customer, User } = require("../../../src/models");
const bcrypt = require("bcryptjs");

describe("GET /api/sales/receipts (authenticated)", () => {
  let token;
  let customer;
  let user;

  beforeAll(async () => {
    // Clean and re-sync database
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.drop();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    await sequelize.sync({ force: true });

    // Create test user
    const passwordHash = await bcrypt.hash("password123", 10);
    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: passwordHash,
      role: "ACCOUNTANT",
    });

    // Authenticate to get JWT token
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    token = res.body.token;

    // Create customer
    customer = await Customer.create({
      name: "Acme Corp",
      email: "acme@example.com",
      created_by: user.id,
    });

    // Create receipt
    await Receipt.create({
      receipt_number: "RCPT-001",
      amount: 500,
      currency: "USD",
      customer_id: customer.id,
      created_by: user.id,
      invoice_id: null,
      period_id: null,
      payment_date: new Date(),
    });
  });

  it("should return all receipts when authenticated", async () => {
    const res = await request(app)
      .get("/api/sales/receipts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("receipt_number");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
