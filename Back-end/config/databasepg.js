const { Client, DatabaseError } = require("pg");
const dotenv = require("dotenv").config;

dotenv();
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  }
};

module.exports = { client, connectDb };
