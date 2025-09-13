import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({
  businessInfo: {
    size: {
      type: Number,
      required: true
    },
    seating: {
      type: Number,
      required: true
    },
    gas: {
      type: Boolean,
      required: true
    },
    delivery: {
      type: Boolean,
      required: true
    }
  },
  aiReport: {
    type: String,
    required: true
  },
  regulationsCount: {
    type: Number,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  // Optional: Store the filtered regulations IDs for reference
  regulationIds: [String],
  // Metadata
  metadata: {
    model: {
      type: String,
      default: "claude-3-haiku-20240307"
    },
    tokensUsed: Number,
    processingTime: Number, // in milliseconds
    success: {
      type: Boolean,
      default: true
    }
  }
});

// Index for better query performance
aiReportSchema.index({ "businessInfo.size": 1, "businessInfo.seating": 1 });
aiReportSchema.index({ "businessInfo.gas": 1, "businessInfo.delivery": 1 });
aiReportSchema.index({ generatedAt: -1 });

export default mongoose.model("AIReport", aiReportSchema);
