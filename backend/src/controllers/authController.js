import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  return token;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";
    const user = await User.create({ name, email, password, role });
    generateTokenAndSetCookie(res, user._id);
    
    res.status(201).json({ message: "Account created", user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const inputEmail = email?.toLowerCase().trim();

    // Special Admin Login via .env credentials (NO DATABASE CHECK)
    if (adminEmail && inputEmail === adminEmail && password === adminPassword) {
      const adminToken = jwt.sign({ id: "ADMIN_ID_VIRTUAL" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      
      res.cookie("token", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ 
        message: "Admin login successful", 
        user: { name: "Super Admin", email: adminEmail, role: "admin", _id: "ADMIN_ID_VIRTUAL" } 
      });
    }

    // Normal Login (Requires DB)
    const user = await User.findOne({ email: inputEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    generateTokenAndSetCookie(res, user._id.toString());
    res.json({ message: "Login successful", user: user.toJSON() });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    await user.save();
    res.json({ message: "Profile updated", user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
