import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color
    );
    if (existingIndex > -1) cart.items[existingIndex].quantity += quantity;
    else cart.items.push({ product: productId, quantity, size, color, price: product.price });
    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (quantity < 1) cart.items.pull(req.params.itemId);
    else item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = []; await cart.save(); }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
