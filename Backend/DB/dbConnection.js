import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    console.log(chalk.yellow.bold("🔄 מתחבר למסד הנתונים..."));

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.green.bold(`✅ חיבור למסד הנתונים הצליח!`));
    console.log(chalk.cyan(`🏠 מארח: ${conn.connection.host}`));
    console.log(chalk.magenta(`📦 מסד נתונים: ${conn.connection.name}`));
    console.log(chalk.blue("━".repeat(50)));

    // Event listeners for connection
    mongoose.connection.on("error", (err) => {
      console.log(chalk.red.bold("❌ שגיאה במסד הנתונים:"), err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(chalk.yellow.bold("⚠️  נותק ממסד הנתונים"));
    });

    mongoose.connection.on("reconnected", () => {
      console.log(chalk.green.bold("🔄 התחבר מחדש למסד הנתונים"));
    });

    return conn;
  } catch (error) {
    console.log(chalk.red.bold("❌ כשל בחיבור למסד הנתונים:"));
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

export default connectDB;
