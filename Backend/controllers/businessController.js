import PDFProcessor from "../services/pdfProcessor.js";
import Regulation from "../DB/models/businessSchema.js";
import AIReport from "../DB/models/aiReportSchema.js";
import { generateBusinessReport } from "../services/llmService.js";
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

    // Generate comprehensive AI report
    const businessInfo = { size, seating, gas, delivery };
    const startTime = Date.now();
    
    console.log("[getBusinessRequirements] Generating AI report...");
    const aiReport = await generateBusinessReport(filteredRegulations, businessInfo);
    const processingTime = Date.now() - startTime;
    
    console.log("[getBusinessRequirements] AI report generated successfully");

    // Save AI report to MongoDB
    try {
      const aiReportDoc = new AIReport({
        businessInfo,
        aiReport,
        regulationsCount: filteredRegulations.length,
        regulationIds: filteredRegulations.map(reg => reg.id || reg._id),
        metadata: {
          model: "claude-3-haiku-20240307",
          processingTime,
          success: true
        }
      });
      
      await aiReportDoc.save();
      console.log("[getBusinessRequirements] AI report saved to MongoDB");
    } catch (saveError) {
      console.error("[getBusinessRequirements] Error saving AI report to MongoDB:", saveError);
      // Don't fail the request if saving fails
    }

    res.json({
      inputs: { size, seating, gas, delivery },
      totalFound: filteredRegulations.length,
      regulations: filteredRegulations,
      aiReport,
      summary: processor.getSummary(filteredRegulations),
    });
  } catch (error) {
    console.error("Error in getBusinessRequirements:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};

// Get AI reports by business parameters
export const getAIReports = async (req, res) => {
  try {
    const { size, seating, gas, delivery } = req.query;
    
    const query = {};
    if (size) query["businessInfo.size"] = parseInt(size);
    if (seating) query["businessInfo.seating"] = parseInt(seating);
    if (gas !== undefined) query["businessInfo.gas"] = gas === 'true';
    if (delivery !== undefined) query["businessInfo.delivery"] = delivery === 'true';
    
    const reports = await AIReport.find(query)
      .sort({ generatedAt: -1 })
      .limit(10)
      .select('businessInfo aiReport generatedAt metadata');
    
    res.json({
      reports,
      count: reports.length
    });
  } catch (error) {
    console.error("Error in getAIReports:", error);
    res.status(500).json({ error: "An error occurred while retrieving AI reports" });
  }
};

// Test endpoint to check AIReport model
export const testAIReport = async (req, res) => {
  try {
    console.log("[testAIReport] Testing AIReport model...");
    
    // Test creating a simple AI report
    const testReport = new AIReport({
      businessInfo: {
        size: 100,
        seating: 20,
        gas: true,
        delivery: false
      },
      aiReport: "This is a test AI report",
      regulationsCount: 5,
      regulationIds: ["test-1", "test-2"],
      metadata: {
        model: "test",
        processingTime: 1000,
        success: true
      }
    });
    
    const savedReport = await testReport.save();
    console.log("[testAIReport] Test report saved with ID:", savedReport._id);
    
    // Count total reports
    const totalReports = await AIReport.countDocuments();
    console.log("[testAIReport] Total AI reports in database:", totalReports);
    
    res.json({
      success: true,
      testReportId: savedReport._id,
      totalReports,
      message: "AIReport model is working correctly"
    });
  } catch (error) {
    console.error("[testAIReport] Error testing AIReport model:", error);
    res.status(500).json({ 
      success: false,
      error: "Error testing AIReport model",
      details: error.message 
    });
  }
};
