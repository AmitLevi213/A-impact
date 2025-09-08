const express = require("express");
const cors = require("cors");
// const uploadRouter = require("./routes/upload");
// const reportRouter = require("./routes/report");
const { default: chalk } = require("chalk");
const logger = require("./logger/loggerService");
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
// app.use("/api/upload", uploadRouter);
// app.use("/api/generate-report", reportRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(chalk.blueBright(`Server running on port ${PORT}`))
);
