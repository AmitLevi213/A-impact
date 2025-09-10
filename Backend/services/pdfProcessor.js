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

  async processPDF(filePath, businessParams = null) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);

      this.processedData.metadata.sourceFile = filePath;

      const cleanText = cleanHebrewText(pdfData.text);
      const sections = splitIntoSections(cleanText);

      sections.forEach((section, index) =>
        processSection(section, index, this.categories)
      );

      finalizeData(this.categories, this.processedData);

      // If business parameters provided, filter before saving
      if (businessParams) {
        this.filterByBusinessParams(businessParams);
      }

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

      // Always save regulations (they get filtered by business parameters later)
      console.log("Saving regulations to MongoDB...");

      // Save all regulations to MongoDB
      const regulationsToSave = [];

      Object.keys(this.processedData).forEach((category) => {
        if (
          category !== "metadata" &&
          Array.isArray(this.processedData[category])
        ) {
          this.processedData[category].forEach((regulation) => {
            // Ensure standards is properly formatted
            let standards = regulation.standards;
            if (typeof standards === "string") {
              try {
                standards = JSON.parse(standards);
              } catch (e) {
                console.log(
                  "Warning: Could not parse standards string:",
                  standards
                );
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
              metadata: this.processedData.metadata,
            });
          });
        }
      });

      if (regulationsToSave.length > 0) {
        await Regulation.insertMany(regulationsToSave);
        console.log(
          `Successfully saved ${regulationsToSave.length} regulations to MongoDB`
        );
      } else {
        console.log("No regulations to save");
      }
    } catch (error) {
      console.error("Error saving to MongoDB:", error);
      // Don't throw error, just log it so processing can continue
      console.log("Continuing without MongoDB save...");
    }
  }

  filterByBusinessParams({ size, seating, gas, delivery }) {
    // Filter processedData based on business parameters
    if (!delivery) {
      this.processedData.deliveries = [];
    }
    if (!gas) {
      this.processedData.fireAndGas = [];
    }
    if (seating <= 0) {
      this.processedData.seating = [];
    }
    if (size <= 0) {
      this.processedData.businessSize = [];
    }

    // Update metadata
    this.processedData.metadata.totalRegulations = 
      this.processedData.deliveries.length +
      this.processedData.seating.length +
      this.processedData.businessSize.length +
      this.processedData.fireAndGas.length;
  }

  async getFilteredRegulations(size, seating, gas, delivery) {
    try {
      if (!process.env.MONGODB_URI) {
        console.log("MongoDB not configured, returning empty array");
        return [];
      }

      const businessParams = { size, seating, gas, delivery };
      const allRegulations = await Regulation.find();
      
      // Score and filter regulations based on business relevance
      const scoredRegulations = allRegulations
        .map(regulation => ({
          ...regulation.toObject(),
          relevanceScore: this.calculateRelevanceScore(regulation, businessParams)
        }))
        .filter(regulation => regulation.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Limit to top 6 regulations per category
      const limitedRegulations = this.limitRegulationsByCategory(scoredRegulations);

      console.log(`Found ${scoredRegulations.length} relevant regulations, returning ${limitedRegulations.length} after limiting`);
      return limitedRegulations;
    } catch (error) {
      console.error("Error filtering regulations from MongoDB:", error);
      return [];
    }
  }

  calculateRelevanceScore(regulation, businessParams) {
    const { size, seating, gas, delivery } = businessParams;
    let score = 0;

    // Base score for category match
    if (regulation.category === 'deliveries' && delivery === true) {
      score += 100;
    } else if (regulation.category === 'fireAndGas' && gas === true) {
      score += 100;
    } else if (regulation.category === 'seating' && seating > 0) {
      score += 100;
    } else if (regulation.category === 'businessSize' && size > 0) {
      score += 100;
    } else {
      return 0; // No match for this category
    }

    // Size-based scoring for seating
    if (regulation.category === 'seating' && seating > 0) {
      const seatingThresholds = [
        { min: 0, max: 10, score: 20 },
        { min: 11, max: 30, score: 40 },
        { min: 31, max: 50, score: 60 },
        { min: 51, max: 100, score: 80 },
        { min: 101, max: Infinity, score: 100 }
      ];
      
      const threshold = seatingThresholds.find(t => seating >= t.min && seating <= t.max);
      if (threshold) {
        score += threshold.score;
      }

      // Check if regulation content mentions specific seating numbers
      const content = regulation.content.toLowerCase();
      if (content.includes(seating.toString()) || 
          content.includes(`${seating} איש`) ||
          content.includes(`${seating} מקומות`)) {
        score += 50; // Bonus for exact match
      }
    }

    // Size-based scoring for business size
    if (regulation.category === 'businessSize' && size > 0) {
      const sizeThresholds = [
        { min: 0, max: 50, score: 20 },
        { min: 51, max: 100, score: 40 },
        { min: 101, max: 200, score: 60 },
        { min: 201, max: 500, score: 80 },
        { min: 501, max: Infinity, score: 100 }
      ];
      
      const threshold = sizeThresholds.find(t => size >= t.min && size <= t.max);
      if (threshold) {
        score += threshold.score;
      }

      // Check if regulation content mentions specific size numbers
      const content = regulation.content.toLowerCase();
      if (content.includes(size.toString()) || 
          content.includes(`${size} מ\"ר`) ||
          content.includes(`${size} מטר`)) {
        score += 50; // Bonus for exact match
      }
    }

    // Importance scoring
    if (regulation.importance === 'high') {
      score += 30;
    } else if (regulation.importance === 'medium') {
      score += 20;
    } else if (regulation.importance === 'low') {
      score += 10;
    }

    // Keyword density scoring
    const content = regulation.content.toLowerCase();
    const keywordCount = regulation.keywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    ).length;
    score += keywordCount * 5;

    return score;
  }

  limitRegulationsByCategory(regulations) {
    const categoryLimits = {
      deliveries: 0,
      seating: 0,
      businessSize: 0,
      fireAndGas: 0
    };

    return regulations.filter(regulation => {
      if (categoryLimits[regulation.category] < 6) {
        categoryLimits[regulation.category]++;
        return true;
      }
      return false;
    });
  }

  getSummary(filteredRegulations = []) {
    // If no filtered regulations provided, return summary of all processed data
    if (filteredRegulations.length === 0) {
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

    // Return summary based on filtered regulations
    const categoryCounts = {
      deliveries: 0,
      seating: 0,
      businessSize: 0,
      fireAndGas: 0
    };

    const importanceCounts = {
      high: 0,
      medium: 0,
      low: 0
    };

    filteredRegulations.forEach(regulation => {
      categoryCounts[regulation.category]++;
      importanceCounts[regulation.importance]++;
    });

    return {
      totalRegulations: filteredRegulations.length,
      byCategory: categoryCounts,
      byImportance: importanceCounts,
      processedAt: this.processedData.metadata.processedAt,
    };
  }
}

export default PDFProcessor;
