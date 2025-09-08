import express from "express";
import cors from "cors";
import chalk from "chalk";
import morganLogger from "./logger/loggers/morganLogger.js";
import { handleError } from "./utils/handleErrors.js";
import router from "./route/router.js";
import connectDB from "./DB/dbConnection.js";
import dotenv from "dotenv"; 

dotenv.config(); 

const app = express();
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
