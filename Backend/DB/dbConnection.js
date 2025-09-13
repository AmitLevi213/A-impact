import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    console.log(chalk.yellow.bold("🔄 Connecting to database..."));

    // Use environment variable or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/a-impact";
    console.log(chalk.cyan(`🔗 Connecting to: ${mongoURI}`));

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.green.bold(`✅ Database connection successful!`));
    console.log(chalk.cyan(`🏠 Host: ${conn.connection.host}`));
    console.log(chalk.magenta(`📦 Database: ${conn.connection.name}`));
    console.log(chalk.blue("━".repeat(50)));

    // Event listeners for connection
    mongoose.connection.on("error", (err) => {
      console.log(chalk.red.bold("❌ Database error:"), err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(chalk.yellow.bold("⚠️  Disconnected from database"));
    });

    mongoose.connection.on("reconnected", () => {
      console.log(chalk.green.bold("🔄 Reconnected to database"));
    });

    return conn;
  } catch (error) {
    console.log(chalk.red.bold("❌ Database connection failed:"));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

export default connectDB;
