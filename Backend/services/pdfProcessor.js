import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

import { categories } from "./core/categories.js";
import { cleanHebrewText } from "./utils/cleanText.js";
import { splitIntoSections } from "./utils/sectionSplitter.js";
import { processSection } from "./core/processSection.js";
import { finalizeData } from "./core/finalizeData.js";

class PDFProcessor {
  constructor() {
    this.categories = JSON.parse(JSON.stringify(categories));
    this.processedData = {
      deliveries: [],
      seating: [],
      businessSize: [],
      fireAndGas: [],
      metadata: {
        processedAt: new Date().toISOString(),
        totalRegulations: 0,
        sourceFile: null,
      },
    };
  }

  async processPDF(filePath) {
    try {
      console.log(`Processing PDF file: ${filePath}`);
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);

      this.processedData.metadata.sourceFile = filePath;

      const cleanText = cleanHebrewText(pdfData.text);
      const sections = splitIntoSections(cleanText);

      sections.forEach((section, index) =>
        processSection(section, index, this.categories)
      );

      finalizeData(this.categories, this.processedData);

      console.log(
        `Processing complete. Found ${this.processedData.metadata.totalRegulations} regulations.`
      );
      return this.processedData;
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw error;
    }
  }

  async saveToFile(outputPath) {
    const jsonData = JSON.stringify(this.processedData, null, 2);
    fs.writeFileSync(outputPath, jsonData, "utf8");
    console.log(`Data saved to: ${outputPath}`);
  }

  getSummary() {
    return {
      totalRegulations: this.processedData.metadata.totalRegulations,
      byCategory: {
        deliveries: this.processedData.deliveries.length,
        seating: this.processedData.seating.length,
        businessSize: this.processedData.businessSize.length,
        fireAndGas: this.processedData.fireAndGas.length,
      },
      byImportance: {
        high: Object.values(this.processedData)
          .flat()
          .filter((item) => item.importance === "high").length,
        medium: Object.values(this.processedData)
          .flat()
          .filter((item) => item.importance === "medium").length,
        low: Object.values(this.processedData)
          .flat()
          .filter((item) => item.importance === "low").length,
      },
      processedAt: this.processedData.metadata.processedAt,
    };
  }
}

export default PDFProcessor;
