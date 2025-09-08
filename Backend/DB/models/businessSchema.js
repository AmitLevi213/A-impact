import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  size: Number,
  seating: Number,
  gas: Boolean,
  delivery: Boolean,
  requirements: [String],
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("BusinessReport", businessSchema);
