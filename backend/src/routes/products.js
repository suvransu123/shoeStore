import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";
import { createProduct, updateProduct, deleteProduct } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
