import express from "express";
import cors from "cors";
// import uploadRouter from "./routes/upload";
// import reportRouter from "./routes/report";
import chalk from "chalk";
import morganLogger from "./logger/loggers/morganLogger.js"; // Update import

const app = express();
app.use(cors());
app.use(express.json());
app.use(morganLogger);

// app.use("/api/upload", uploadRouter);
// app.use("/api/generate-report", reportRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(chalk.blueBright(`Server running on port ${PORT}`))
);
