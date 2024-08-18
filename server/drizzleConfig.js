import pkg from "pg";
const { Client } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import UserModel from "./models/userModel.js"; // Import the UserModel
import MessagesModel from "./models/messageModel.js";
import * as fs from 'fs'
import 'dotenv/config'

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
};

const client = new Client(config);

const main = async () => {
  await client.connect();
  const db = drizzle(client);

  // Define the migration
  const migration = async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_avatar_image_set BOOLEAN DEFAULT FALSE,
        avatar_image VARCHAR DEFAULT ''
      );
    `);
  };

  const messageMigration = async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        sender_id VARCHAR NOT NULL,
        receiver_id VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_online BOOLEAN DEFAULT FALSE
      );
    `);
  };

  // Run the migration
  try {
    await migration();
    await messageMigration();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }

  return db;
};

const db = await main();

export { db, UserModel, MessagesModel };