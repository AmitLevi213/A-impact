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

    let regulations = [];
    
    // Try to get regulations from MongoDB first
    try {
      regulations = await Regulation.find();
      console.log(`Found ${regulations.length} regulations in MongoDB`);
      
      // Debug: Check what categories we have
      const categoryBreakdown = {};
      regulations.forEach(reg => {
        categoryBreakdown[reg.category] = (categoryBreakdown[reg.category] || 0) + 1;
      });
      console.log("MongoDB category breakdown:", categoryBreakdown);
      
    } catch (error) {
      console.log("MongoDB not available, processing PDF directly...");
    }
    
    // If no regulations in MongoDB, process PDF
    if (regulations.length === 0) {
      console.log("No regulations found in MongoDB, processing PDF...");
      const processor = new PDFProcessor();
      const pdfPath = path.resolve(process.cwd(), "Food-Regulations.pdf");
      await processor.processPDF(pdfPath);
      
      // Try to fetch from MongoDB again, or use processed data
      try {
        regulations = await Regulation.find();
        console.log(`After PDF processing: Found ${regulations.length} regulations in MongoDB`);
      } catch (error) {
        // If MongoDB still not available, use processed data directly
        const data = processor.processedData;
        regulations = [];
        Object.keys(data).forEach(category => {
          if (category !== 'metadata' && Array.isArray(data[category])) {
            console.log(`Adding ${data[category].length} regulations for category: ${category}`);
            regulations.push(...data[category]);
          }
        });
        console.log(`Total regulations from processed data: ${regulations.length}`);
      }
    }

    // Filter regulations based on form inputs
    const filtered = [];
    const categoryCounts = {
      deliveries: 0,
      seating: 0,
      businessSize: 0,
      fireAndGas: 0
    };
    
    // Debug: Get businessSize regulations for fallback logic
    const businessSizeRegs = regulations.filter(r => r.category === 'businessSize');
    
    regulations.forEach(regulation => {
      let shouldInclude = false;
      let reason = "";
      
      if (delivery && regulation.category === 'deliveries') {
        shouldInclude = true;
        reason = "delivery enabled";
        categoryCounts.deliveries++;
      }
      if (gas && regulation.category === 'fireAndGas') {
        shouldInclude = true;
        reason = "gas enabled";
        categoryCounts.fireAndGas++;
      }
      if (seating > 0 && regulation.category === 'seating') {
        shouldInclude = true;
        reason = `seating: ${seating}`;
        categoryCounts.seating++;
      }
      if (size > 0 && regulation.category === 'businessSize') {
        shouldInclude = true;
        reason = `size: ${size} sqm`;
        categoryCounts.businessSize++;
      }
      
      // Fallback: If no businessSize regulations and size > 0, include size-related regulations from other categories
      if (size > 0 && regulation.category !== 'businessSize' && businessSizeRegs.length === 0) {
        const content = regulation.content.toLowerCase();
        if (content.includes('מ"ר') || content.includes('שטח') || content.includes('גודל') || 
            content.includes('מטר') || content.includes('מידות') || content.includes('מקום')) {
          shouldInclude = true;
          reason = `size-related content from ${regulation.category}`;
          categoryCounts.businessSize++;
        }
      }
      
      if (shouldInclude) {
        filtered.push(regulation);
      }
    });
    
    // Limit filtered regulations to maximum 6 per category
    const limitedFiltered = [];
    const categoryLimits = {
      deliveries: 0,
      seating: 0,
      businessSize: 0,
      fireAndGas: 0
    };

    filtered.forEach(regulation => {
      if (categoryLimits[regulation.category] < 6) {
        limitedFiltered.push(regulation);
        categoryLimits[regulation.category]++;
      }
    });

    console.log("Category counts:", categoryCounts);
    console.log(`Total regulations found: ${regulations.length}`);
    console.log(`Filtered regulations: ${filtered.length}`);
    console.log(`Limited filtered regulations: ${limitedFiltered.length}`);
    console.log("Category limits applied:", categoryLimits);

    // Get summary statistics based on LIMITED FILTERED regulations only
    const summary = {
      totalRegulations: limitedFiltered.length, // Only count limited filtered regulations
      byCategory: {
        deliveries: limitedFiltered.filter(r => r.category === 'deliveries').length,
        seating: limitedFiltered.filter(r => r.category === 'seating').length,
        businessSize: limitedFiltered.filter(r => r.category === 'businessSize').length,
        fireAndGas: limitedFiltered.filter(r => r.category === 'fireAndGas').length,
      },
      byImportance: {
        high: limitedFiltered.filter(r => r.importance === 'high').length,
        medium: limitedFiltered.filter(r => r.importance === 'medium').length,
        low: limitedFiltered.filter(r => r.importance === 'low').length,
      }
    };

    res.json({
      inputs: { size, seating, gas, delivery },
      totalFound: limitedFiltered.length,
      regulations: limitedFiltered,
      summary: summary,
    });
  } catch (error) {
    console.error("Error in getBusinessRequirements:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};
