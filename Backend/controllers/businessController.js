import {
  baseRequirements,
  sizeRequirements,
  seatingRequirements,
  fireAndGasRequirements,
  deliveryRequirements,
  businessPromptTemplate,
} from "../utils/businessRequirements.js";
// import { generateBusinessFeedback } from "../services/llmService.js";
import BusinessReport from "../DB/models/businessSchema.js";

export const getBusinessRequirements = async (req, res) => {
  try {
    const { size, seating, gas, delivery } = req.body;

    // התחלת דרישות בסיסיות
    let requirements = [...baseRequirements];

    // בדיקות לפי גודל העסק
    const sizeReq = sizeRequirements.find((r) => r.condition(size));
    if (sizeReq) requirements.push(sizeReq.requirement);

    // בדיקות לפי מספר המקומות
    const seatingReq = seatingRequirements.find((r) => r.condition(seating));
    if (seatingReq) requirements.push(seatingReq.requirement);

    // דרישות משלוחים וגז
    if (gas) requirements.push(...fireAndGasRequirements);
    if (delivery) requirements.push(...deliveryRequirements);

    // יצירת דוח מותאם אישית דרך LLM
    // const feedback = await generateBusinessFeedback(
    //   businessPromptTemplate(requirements, { size, seating, gas, delivery })
    // );

    // שמירה במונגו
    const report = new BusinessReport({
      size,
      seating,
      gas,
      delivery,
      requirements,
      // feedback,
    });
    await report.save();

    res.json({ requirements });
  } catch (error) {
    console.error("Error in getBusinessRequirements:", error);
    res.status(500).json({ error: "אירעה שגיאה בעת עיבוד הבקשה" });
  }
};
