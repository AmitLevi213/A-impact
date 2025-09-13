import express from "express";
import rateLimit from "express-rate-limit";
import { getBusinessRequirements, getAIReports, testAIReport } from "../controllers/businessController.js";

const router = express.Router();

// Strict rate limiting for AI report generation (protects tokens)
const aiReportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // Only 2 AI report requests per minute per IP
  message: {
    error: "יותר מדי בקשות לדוח AI, אנא המתן דקה לפני ניסיון נוסף",
    retryAfter: "1 דקה"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Moderate rate limiting for other endpoints
const moderateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per 5 minutes
  message: {
    error: "יותר מדי בקשות, אנא המתן 5 דקות לפני ניסיון נוסף",
    retryAfter: "5 דקות"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to specific routes
router.post("/", aiReportLimiter, getBusinessRequirements); // Strict limiting for AI reports
router.get("/ai-reports", moderateLimiter, getAIReports); // Moderate limiting for data retrieval
router.get("/test-ai-report", moderateLimiter, testAIReport); // Moderate limiting for testing

export default router;
