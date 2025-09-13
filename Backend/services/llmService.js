// LLMService.js
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

export const generateBusinessReport = async (filteredRegulations, businessInfo, apiKey) => {
  try {
    console.log("[LLMService] Generating comprehensive business report");
    
    // Check if API key is available
    const apiKeyToUse = apiKey || process.env.CLAUDE_API_KEY;
    if (!apiKeyToUse) {
      console.error("[LLMService] No API key provided - falling back to simple report");
      throw new Error("No API key provided");
    }
    
    // Create client with provided API key
    const client = new Anthropic({
      apiKey: apiKeyToUse,
    });
    
    // First, validate relevance of regulations using LLM
    const validatedRegulations = await validateRegulationRelevance(filteredRegulations, businessInfo, client);
    console.log(`[LLMService] Relevance validation: ${filteredRegulations.length} -> ${validatedRegulations.length} regulations`);
    
    // Group validated regulations by category
    const categoryGroups = {
      deliveries: validatedRegulations.filter(reg => reg.category === 'deliveries'),
      seating: validatedRegulations.filter(reg => reg.category === 'seating'),
      businessSize: validatedRegulations.filter(reg => reg.category === 'businessSize'),
      fireAndGas: validatedRegulations.filter(reg => reg.category === 'fireAndGas')
    };

    const prompt = `אתה מומחה לתקנות רישוי עסקים בישראל.

פרטי העסק:
- גודל: ${businessInfo.size} מ"ר
- מקומות ישיבה: ${businessInfo.seating}
- שימוש בגז: ${businessInfo.gas ? "כן" : "לא"}
- משלוחים: ${businessInfo.delivery ? "כן" : "לא"}

התקנות הרלוונטיות לפי קטגוריות (אומתו כרלוונטיות לעסק זה):

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

חשוב: התקנות לעיל אומתו כנוגעות ישירות לעסק עם הפרטים שצוינו. כל תקנה רלוונטית לגודל העסק, מספר מקומות הישיבה, או למאפיינים הספציפיים (גז/משלוחים).

אנא צור דוח מקיף ומובן לבעל העסק הכולל:

1. **סיכום כללי** - סקירה קצרה של מה העסק צריך לדעת
2. **דרישות לפי קטגוריות** - לכל קטגוריה רלוונטית:
   - הסבר על החשיבות והרלוונטיות לעסק הספציפי
   - 2 הדרישות החשובות ביותר (התמקד רק בתקנות שנוגעות ישירות לעסק)
   - סדר עדיפויות
3. **המלצות פעולה** - צעדים קונקרטיים למימוש (רק לגבי דרישות רלוונטיות)
4. **טיפים חשובים** - דברים שכדאי לדעת (התמקד בדברים שנוגעים לעסק זה)

השתמש בשפה ברורה ונגישה, לא משפטית. התמקד בפרקטיקה ולא בתיאוריה. ודא שכל המלצה נוגעת ישירות לעסק עם הפרטים שצוינו.`;

    const completion = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    return completion.content[0].text;
  } catch (error) {
    console.error("[LLMService] LLM Error:", error);
    
    // Fallback to simple report if LLM fails
    console.log("[LLMService] Falling back to simple report due to LLM error");
    
    const categoryGroups = {
      deliveries: filteredRegulations.filter(reg => reg.category === 'deliveries'),
      seating: filteredRegulations.filter(reg => reg.category === 'seating'),
      businessSize: filteredRegulations.filter(reg => reg.category === 'businessSize'),
      fireAndGas: filteredRegulations.filter(reg => reg.category === 'fireAndGas')
    };

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
  }
};

async function validateRegulationRelevance(filteredRegulations, businessInfo, client) {
  if (filteredRegulations.length === 0) return [];
  
  console.log(`[LLMService] Validating relevance of ${filteredRegulations.length} regulations`);
  
  try {
    const validationPrompt = `אתה מומחה לתקנות רישוי עסקים בישראל. 

פרטי העסק:
- גודל: ${businessInfo.size} מ"ר
- מקומות ישיבה: ${businessInfo.seating}
- שימוש בגז: ${businessInfo.gas ? "כן" : "לא"}
- משלוחים: ${businessInfo.delivery ? "כן" : "לא"}

התקנות לבדיקה:

${filteredRegulations.map((reg, index) => `
${index + 1}. קטגוריה: ${getCategoryDisplayName(reg.category)}
כותרת: ${reg.title}
תוכן: ${reg.content.substring(0, 300)}...
`).join('\n')}

לכל תקנה, בדוק אם היא באמת רלוונטית לעסק עם הפרטים שצוינו:

- תקנות משלוחים: רק אם העסק עוסק במשלוחים (delivery=true)
- תקנות ישיבה: רק אם יש מקומות ישיבה (seating > 0) והתקנה נוגעת למספר מקומות הישיבה הספציפי
- תקנות גודל: רק אם התקנה נוגעת לגודל העסק הספציפי (${businessInfo.size} מ"ר)
- תקנות אש וגז: רק אם העסק משתמש בגז (gas=true)

החזר רשימה של מספרי התקנות הרלוונטיות בלבד, בפורמט:
RELEVANT: 1,3,5
לא רלוונטיות: 2,4,6

אם אף תקנה לא רלוונטית, החזר: RELEVANT:`;

    const validationCompletion = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [{ role: "user", content: validationPrompt }],
    });

    const validationResponse = validationCompletion.content[0].text;
    console.log(`[LLMService] Validation response: ${validationResponse}`);
    
    // Parse the validation response
    const relevantMatch = validationResponse.match(/RELEVANT:\s*([\d,\s]*)/);
    if (!relevantMatch) {
      console.log("[LLMService] Could not parse validation response, returning all regulations");
      return filteredRegulations;
    }
    
    const relevantIndices = relevantMatch[1]
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= filteredRegulations.length);
    
    const validatedRegulations = relevantIndices.map(index => filteredRegulations[index - 1]);
    
    console.log(`[LLMService] Validation complete: ${validatedRegulations.length}/${filteredRegulations.length} regulations are relevant`);
    return validatedRegulations;
    
  } catch (error) {
    console.error("[LLMService] Error validating regulation relevance:", error);
    console.log("[LLMService] Returning all regulations due to validation error");
    return filteredRegulations;
  }
}

function getCategoryDisplayName(categoryName) {
  const names = {
    deliveries: "דרישות משלוחים",
    seating: "דרישות ישיבה ותפוסה", 
    businessSize: "דרישות גודל העסק",
    fireAndGas: "דרישות בטיחות אש וגז"
  };
  return names[categoryName] || categoryName;
}
