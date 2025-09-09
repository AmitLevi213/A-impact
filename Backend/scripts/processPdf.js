import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PDFProcessor from "../services/pdfProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const processor = new PDFProcessor();
    const pdfPath = path.resolve(__dirname, "../Food-Regulations.pdf");
    const outputPath = path.resolve(__dirname, "../output.json");

    console.log("Resolved PDF path:", pdfPath);
    if (!fs.existsSync(pdfPath)) {
      console.error("PDF file not found at:", pdfPath);
      process.exit(1);
    }

    await processor.processPDF(pdfPath);
    console.log("SUMMARY:", JSON.stringify(processor.getSummary(), null, 2));
    await processor.saveToFile(outputPath);
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
}

main();


