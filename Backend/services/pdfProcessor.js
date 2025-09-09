import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import connectDB from "../DB/dbConnection.js";
import Regulation from "../DB/models/businessSchema.js";

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
      
      // Connect to MongoDB (only if not already connected)
      if (process.env.MONGODB_URI) {
        await connectDB();
      } else {
        console.log("No MongoDB URI found, skipping database connection");
      }
      
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);

      this.processedData.metadata.sourceFile = filePath;

      const cleanText = cleanHebrewText(pdfData.text);
      const sections = splitIntoSections(cleanText);

      sections.forEach((section, index) =>
        processSection(section, index, this.categories)
      );

      finalizeData(this.categories, this.processedData);

      // Save to MongoDB
      await this.saveToMongoDB();

      console.log(
        `Processing complete. Found ${this.processedData.metadata.totalRegulations} regulations.`
      );
      return this.processedData;
    } catch (error) {
      console.error("Error processing PDF:", error);
      throw error;
    }
  }

  async saveToMongoDB() {
    try {
      // Only save to MongoDB if connection is available
      if (!process.env.MONGODB_URI) {
        console.log("MongoDB not configured, skipping database save");
        return;
      }

      // Clear existing regulations
      await Regulation.deleteMany({});
      console.log("Cleared existing regulations from MongoDB");

      // Save all regulations to MongoDB
      const regulationsToSave = [];
      
      Object.keys(this.processedData).forEach(category => {
        if (category !== 'metadata' && Array.isArray(this.processedData[category])) {
          this.processedData[category].forEach(regulation => {
            // Ensure standards is properly formatted
            let standards = regulation.standards;
            if (typeof standards === 'string') {
              try {
                standards = JSON.parse(standards);
              } catch (e) {
                console.log('Warning: Could not parse standards string:', standards);
                standards = [];
              }
            }
            
            // Ensure standards is an array of objects
            if (!Array.isArray(standards)) {
              standards = [];
            }
            
            regulationsToSave.push({
              id: regulation.id,
              category: regulation.category,
              title: regulation.title,
              content: regulation.content,
              requirements: regulation.requirements,
              standards: standards,
              numbers: regulation.numbers,
              sourceReference: regulation.sourceReference,
              keywords: regulation.keywords,
              importance: regulation.importance,
              extractedAt: new Date(regulation.extractedAt),
              metadata: this.processedData.metadata
            });
          });
        }
      });

      if (regulationsToSave.length > 0) {
        await Regulation.insertMany(regulationsToSave);
        console.log(`Successfully saved ${regulationsToSave.length} regulations to MongoDB`);
      } else {
        console.log("No regulations to save");
      }
    } catch (error) {
      console.error("Error saving to MongoDB:", error);
      // Don't throw error, just log it so processing can continue
      console.log("Continuing without MongoDB save...");
    }
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
