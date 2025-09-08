// businessController.js
import { deliveryRequirements } from "./deliveryRequirements.js";
import { generateBusinessFeedback } from "./LLMService.js";

export const getBusinessRequirements = async (req, res) => {
  const { size, seating, gas, delivery } = req.body;

  let requirements = ["רישיון עסק כללי"];

  if (size > 100) {
    requirements.push("אישור כיבוי אש לעסק גדול");
  }

  if (seating > 50) {
    requirements.push("אישור משרד הבריאות לעסקי מזון עם תפוסה גבוהה");
  }

  if (gas) {
    requirements.push("אישור שימוש בגז");
  }

  if (delivery) {
    requirements.push(...deliveryRequirements);
  }

  // הפעלת המודל לשפה ליצירת דוח מותאם
  const feedback = await generateBusinessFeedback(requirements, {
    size,
    seating,
    gas,
    delivery,
  });

  res.json({
    requirements,
    feedback,
  });
};
