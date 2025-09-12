// LLMService.js
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

export const generateBusinessReport = async (filteredRegulations, businessInfo, apiKey) => {
  // LLM Service temporarily disabled to save costs
  // Uncomment the code below to re-enable AI-powered reports
  
  console.log("[LLMService] LLM service disabled - returning fallback report");
  
  // Group regulations by category for fallback report
  const categoryGroups = {
    deliveries: filteredRegulations.filter(reg => reg.category === 'deliveries'),
    seating: filteredRegulations.filter(reg => reg.category === 'seating'),
    businessSize: filteredRegulations.filter(reg => reg.category === 'businessSize'),
    fireAndGas: filteredRegulations.filter(reg => reg.category === 'fireAndGas')
  };

  // Generate simple fallback report
  let report = `דוח דרישות רישוי לעסק\n`;
  report += `פרטי העסק: גודל ${businessInfo.size} מ"ר, ${businessInfo.seating} מקומות ישיבה\n`;
  report += `שימוש בגז: ${businessInfo.gas ? "כן" : "לא"}, משלוחים: ${businessInfo.delivery ? "כן" : "לא"}\n\n`;
  
  Object.entries(categoryGroups).forEach(([categoryName, regulations]) => {
    if (regulations.length > 0) {
      report += `\n${getCategoryDisplayName(categoryName)}:\n`;
      regulations.forEach(reg => {
        report += `- ${reg.title}\n`;
        report += `  ${reg.content.substring(0, 200)}...\n`;
      });
    }
  });
  
  report += `\n\nהערה: דוח מפורט יותר זמין עם הפעלת שירות ה-AI.`;
  
  return report;

  /* 
  // UNCOMMENT TO RE-ENABLE AI REPORTS:
  try {
    console.log("[LLMService] Generating comprehensive business report");
    
    // Create client with provided API key
    const client = new Anthropic({
      apiKey: apiKey || process.env.CLAUDE_API_KEY,
    });
    
    // Group regulations by category
    const categoryGroups = {
      deliveries: filteredRegulations.filter(reg => reg.category === 'deliveries'),
      seating: filteredRegulations.filter(reg => reg.category === 'seating'),
      businessSize: filteredRegulations.filter(reg => reg.category === 'businessSize'),
      fireAndGas: filteredRegulations.filter(reg => reg.category === 'fireAndGas')
    };

    const prompt = `אתה מומחה לתקנות רישוי עסקים בישראל.

פרטי העסק:
- גודל: ${businessInfo.size} מ"ר
- מקומות ישיבה: ${businessInfo.seating}
- שימוש בגז: ${businessInfo.gas ? "כן" : "לא"}
- משלוחים: ${businessInfo.delivery ? "כן" : "לא"}

התקנות הרלוונטיות לפי קטגוריות:

${Object.entries(categoryGroups).map(([categoryName, regulations]) => {
  if (regulations.length === 0) return '';
  return `
**${getCategoryDisplayName(categoryName)}:**
${regulations.map(reg => `
- ${reg.title}
  ${reg.content}
  דרישות: ${reg.requirements.map(req => req.text).join('; ')}
`).join('\n')}`;
}).filter(Boolean).join('\n\n')}

אנא צור דוח מקיף ומובן לבעל העסק הכולל:

1. **סיכום כללי** - סקירה קצרה של מה העסק צריך לדעת
2. **דרישות לפי קטגוריות** - לכל קטגוריה רלוונטית:
   - הסבר על החשיבות
   - 2 הדרישות החשובות ביותר
   - סדר עדיפויות
3. **המלצות פעולה** - צעדים קונקרטיים למימוש
4. **טיפים חשובים** - דברים שכדאי לדעת

השתמש בשפה ברורה ונגישה, לא משפטית. התמקד בפרקטיקה ולא בתיאוריה.`;

    const completion = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    return completion.content[0].text;
  } catch (error) {
    console.error("LLM Error:", error);
    return "אירעה שגיאה בעת יצירת הדוח. אנא נסה שוב מאוחר יותר.";
  }
  */
};

function getCategoryDisplayName(categoryName) {
  const names = {
    deliveries: "דרישות משלוחים",
    seating: "דרישות ישיבה ותפוסה", 
    businessSize: "דרישות גודל העסק",
    fireAndGas: "דרישות בטיחות אש וגז"
  };
  return names[categoryName] || categoryName;
}
