import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://shoestore-gwxp.onrender.com",
    "https://shoestroe.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Shoe Store API is running" });
});

const PORT = process.env.PORT || 5001;

const ServerStart = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

ServerStart();
