import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's the Virtual Admin from .env (not in DB)
    if (decoded.id === "ADMIN_ID_VIRTUAL") {
      req.user = {
        _id: "ADMIN_ID_VIRTUAL",
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin"
      };
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
