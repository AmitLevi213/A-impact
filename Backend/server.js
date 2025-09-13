import express from "express";
import cors from "cors";
import chalk from "chalk";
import rateLimit from "express-rate-limit";
import morganLogger from "./logger/loggers/morganLogger.js";
import { handleError } from "./utils/handleErrors.js";
import router from "./route/router.js";
import connectDB from "./DB/dbConnection.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "יותר מדי בקשות, אנא נסה שוב מאוחר יותר",
    retryAfter: "15 דקות"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for business endpoint (AI token protection)
const businessLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per minute
  message: {
    error: "יותר מדי בקשות לדוח עסקי, אנא המתן דקה לפני ניסיון נוסף",
    retryAfter: "1 דקה"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
});

// Apply rate limiting
app.use(generalLimiter);
app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(router);
app.use((err, req, res, next) => {
  handleError(res, 500, err.message);
});
const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  () => console.log(chalk.blueBright(`Server running on port ${PORT}`)),
  connectDB()
);
