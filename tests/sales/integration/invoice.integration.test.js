// tests/sales/integration/invoice.integration.test.js
const request = require("supertest");
const app = require("../../../server");
const { sequelize, Invoice, Customer, User } = require("../../../src/models");
const bcrypt = require("bcryptjs");

describe("GET /api/sales/invoices (authenticated)", () => {
  let token;
  let customer;
  let user;

  beforeAll(async () => {
    // Sync database (clean test DB)
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.drop(); // Drops all tables
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    await sequelize.sync(); // Recreate all tables

    const passwordHash = await bcrypt.hash("mypassword", 10);

    // 🧑‍💻 Create a test user (same credentials as login endpoint)
    user = await User.create({
      name: "Camilo",
      email: "camilo@example.com",
      password_hash: passwordHash, // make sure password hashing matches your app logic
      role: 'ADMIN'
    });

    // console.log('user:', user)

    // 🔐 Log in to get a token
    const resLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "camilo@example.com",
        password: "mypassword",
      });
    
    token = resLogin.body.token;

    // 🧾 Create a customer (since Invoice.customer_id references it)
    customer = await Customer.create({
      name: "ACME Ltd.",
      email: "acme@example.com",
      created_by: user.id
    });

    // 🧾 Seed invoices with valid data
    await Invoice.create({
      invoice_number: "INV-001",
      issue_date: new Date(),
      customer_id: customer.id,
      total_amount: 1200,
      created_by: user.id,
    });
    await Invoice.create({
      invoice_number: "INV-002",
      issue_date: new Date(),
      customer_id: customer.id,
      total_amount: 850,
      created_by: user.id,
    });
  });

  it("should return all invoices when authenticated", async () => {
    const res = await request(app)
      .get("/api/sales/invoices")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
