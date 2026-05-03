import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import products from "./Product.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correctly load .env from the backend root
dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data (Note: We keep Users so you don't lose your registrations)
    await Product.deleteMany();
    await Cart.deleteMany();
    console.log("🗑️ Cleared existing products and carts");

    // Insert products without requiring an admin user
    await Product.insertMany(products);
    console.log(`👟 Seeded ${products.length} products`);

    console.log("✨ Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
