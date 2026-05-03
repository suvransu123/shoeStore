import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "shoes_app" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image || "";

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const productData = { ...req.body, image: imageUrl, createdBy: req.user._id };
    
    if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);
    if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);

    const product = await Product.create(productData);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
    if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};