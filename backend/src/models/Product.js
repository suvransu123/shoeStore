import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["SNEAKERS", "SPORTS", "BOOTS", "SANDALS", "FORMAL", "Running", "Casual", "Sports", "Boots", "Sandals"],
    },
    brand: { type: String, required: true, trim: true },
    sizes: { type: [Number], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
