const { Client } = require("pg");
require("dotenv").config();
const { faker } = require("@faker-js/faker");

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  await client.connect();
  console.log("✅ Connected to database");

  // --- Seed Users ---
  const users = Array.from({ length: 50000 }).map(() => [
    `${faker.person.firstName()} ${faker.person.lastName()}`,
    faker.internet
      .email()
      .replace("@", `${faker.number.int({ min: 1000, max: 9999 })}@`),
  ]);

  for (const u of users) {
    await client.query(`INSERT INTO "User" (name, email) VALUES ($1, $2)`, u);
  }
  console.log("👤 Users seeded");

  // --- Seed Products ---
  const products = Array.from({ length: 10000 }).map(() => [
    faker.commerce.productName(),
    parseFloat(faker.commerce.price()),
  ]);

  for (const p of products) {
    await client.query(
      `INSERT INTO "Product" (name, price) VALUES ($1, $2)`,
      p
    );
  }
  console.log("📦 Products seeded");

  const { rows: userRows } = await client.query(`SELECT id FROM "User"`);
  const { rows: productRows } = await client.query(`SELECT id FROM "Product"`);

  const orders = Array.from({ length: 500000 }).map(() => [
    userRows[Math.floor(Math.random() * userRows.length)].id,
    productRows[Math.floor(Math.random() * productRows.length)].id,
    Math.floor(Math.random() * 10) + 1,
  ]);

  for (const o of orders) {
    await client.query(
      `INSERT INTO "Order" ("userId", "productId", amount) VALUES ($1, $2, $3)`,
      o
    );
  }
  console.log("🛒 Orders seeded");

  await client.end();
  console.log("✅ Done seeding!");
}

main().catch((e) => {
  console.error(e);
  client.end();
});
