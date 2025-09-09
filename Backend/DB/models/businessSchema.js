import mongoose from "mongoose";

const regulationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['deliveries', 'seating', 'businessSize', 'fireAndGas'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  requirements: [{
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['mandatory', 'optional', 'forbidden', 'general'],
      default: 'general'
    },
    mandatory: {
      type: Boolean,
      default: false
    }
  }],
  standards: [{
    standard: String,
    context: String
  }],
  numbers: [{
    value: Number,
    unit: String,
    context: String
  }],
  sourceReference: String,
  keywords: [String],
  importance: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'low'
  },
  extractedAt: {
    type: Date,
    default: Date.now
  },
  // Metadata
  metadata: {
    processedAt: {
      type: Date,
      default: Date.now
    },
    totalRegulations: Number,
    sourceFile: String
  }
});

// Index for better query performance
regulationSchema.index({ category: 1 });
regulationSchema.index({ keywords: 1 });
regulationSchema.index({ importance: 1 });
regulationSchema.index({ extractedAt: -1 });

export default mongoose.model("Regulation", regulationSchema);
