import PDFProcessor from "../services/pdfProcessor.js";
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
    await processor.processPDF(pdfPath);

    const data = processor.processedData;

    const filtered = [];
    if (delivery) filtered.push(...data.deliveries);
    if (gas) filtered.push(...data.fireAndGas);
    if (seating > 0) filtered.push(...data.seating);
    if (size > 0) filtered.push(...data.businessSize);

    res.json({
      inputs: { size, seating, gas, delivery },
      totalFound: filtered.length,
      regulations: filtered,
      summary: processor.getSummary(),
    });
  } catch (error) {
    console.error("Error in getBusinessRequirements:", error);
    res.status(500).json({ error: "אירעה שגיאה בעת עיבוד הבקשה" });
  }
};
