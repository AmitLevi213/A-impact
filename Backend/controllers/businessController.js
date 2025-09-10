import PDFProcessor from "../services/pdfProcessor.js";
import Regulation from "../DB/models/businessSchema.js";
import path from "path";

export const getBusinessRequirements = async (req, res) => {
  try {
    console.log("[getBusinessRequirements] Incoming request body:", req.body);
    const { size, seating, gas, delivery } = req.body;
    if (
      typeof size !== "number" ||
      typeof seating !== "number" ||
      typeof gas !== "boolean" ||
      typeof delivery !== "boolean"
    ) {
      return res.status(400).json({
        error:
          "Invalid input types. Expected { size:number, seating:number, gas:boolean, delivery:boolean }",
      });
    }

    const processor = new PDFProcessor();
    const pdfPath = path.resolve(process.cwd(), "Food-Regulations.pdf");
    
    // Process PDF with business parameters (will skip if regulations already exist in DB)
    await processor.processPDF(pdfPath, { size, seating, gas, delivery });
    
    // Get filtered regulations from MongoDB based on business parameters
    const filteredRegulations = await processor.getFilteredRegulations(size, seating, gas, delivery);

    res.json({
      inputs: { size, seating, gas, delivery },
      totalFound: filteredRegulations.length,
      regulations: filteredRegulations,
      summary: processor.getSummary(filteredRegulations),
    });
  } catch (error) {
    console.error("Error in getBusinessRequirements:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};
