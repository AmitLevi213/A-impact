// LLMService.js
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // מוגדר ב־.env
});

export const generateBusinessFeedback = async (requirements, businessInfo) => {
  try {
    console.log("[LLMService] generateBusinessFeedback called with:", {
      requirements,
      businessInfo,
    });
    const prompt = `יש לך רשימת דרישות רישוי לעסק בישראל:
${requirements.join("\n")}

פרטי העסק:
- גודל: ${businessInfo.size} מ"ר
- מקומות ישיבה: ${businessInfo.seating}
- שימוש בגז: ${businessInfo.gas ? "כן" : "לא"}
- משלוחים: ${businessInfo.delivery ? "כן" : "לא"}

אנא הפק דוח ברור ומובן לבעל העסק:
- הסבר פשוט על המשמעות של כל דרישה
- סדר עדיפויות (מה חייב מיד ומה אפשר בהמשך)
- שפה נגישה, לא משפטית
- סיכום המלצות פעולה
`;
    console.log("[LLMService] Sending prompt to LLM:", prompt);
    const completion = await client.messages.create({
      model: "claude-opus-4-1-20250805", // or another Claude model
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    console.log("[LLMService] LLM response:", completion);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("LLM Error:", error);
    return "אירעה שגיאה בעת הפקת הדוח מהמודל.";
  }
};
