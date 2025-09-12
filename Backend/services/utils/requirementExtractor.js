export function extractRequirements(regulation) {
  const requirements = [];
  const text = regulation.text;

  // Skip if this looks like document structure rather than actual regulations
  if (isDocumentStructure(text)) {
    return requirements;
  }

  const obligationPatterns = [
    /חייב|נדרש|יש ל|חובה|בהתאם ל/g,
    /לא יעלה על|לא פחות מ|מינימום|מקסימום/g,
    /יותקן|יוצב|יימצא|יוצג|יוצגו/g,
    /רשאי|יכול|מותר|אסור|לא יעשה/g,
    /צריך|נדרש|חייב להיות/g,
    /במקרה של|במידה ו|אם|כאשר/g,
    /תוך|בתוך|לפני|אחרי|במהלך/g,
  ];

  // Split by various sentence delimiters and bullet points
  const sentences = text.split(/[.!?]|•|–|—|\n\s*[א-ת]\)|\n\s*\d+\)/).filter((s) => s.trim().length > 5);

  sentences.forEach((sentence) => {
    const cleanSentence = sentence.trim();
    if (cleanSentence.length > 15 && 
        !isDocumentStructure(cleanSentence) && 
        obligationPatterns.some((pattern) => pattern.test(cleanSentence))) {
      requirements.push({
        text: cleanSentence,
        type: classifyRequirement(cleanSentence),
        mandatory: isMandatory(cleanSentence),
      });
    }
  });

  // If we still don't have enough requirements, try to split by other patterns
  if (requirements.length < 2) {
    const additionalSentences = text.split(/[;,]|ו-|וגם/).filter((s) => s.trim().length > 8);
    additionalSentences.forEach((sentence) => {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length > 10 && !requirements.some(req => req.text === cleanSentence)) {
        requirements.push({
          text: cleanSentence,
          type: classifyRequirement(cleanSentence),
          mandatory: isMandatory(cleanSentence),
        });
      }
    });
  }

  return requirements;
}

function classifyRequirement(text) {
  if (/חייב|חובה/.test(text)) return "mandatory";
  if (/רשאי|יכול/.test(text)) return "optional";
  if (/אסור|לא יעשה/.test(text)) return "forbidden";
  return "general";
}

function isDocumentStructure(text) {
  const structurePatterns = [
    /^[\d\s.,-]+$/,  // Just numbers and punctuation
    /^(?:תוכן עניינים|מפתח|רשימה|טבלה)/i,  // Table of contents
    /^(?:פרק|חלק|סעיף)\s*\d+[א-ת]?\s*$/,  // Just section headers
    /^(?:בית אוכל|מקום הכנה|הגשה של מזון).*למעט עסק.*פריט \d+$/i,  // Document structure
    /^[א-ת]\s*[א-ת]\s*[א-ת]\s*$/,  // Just Hebrew letters
    /^(?:מזון ולרבות|הגשת משקאות).*פריט \d+$/i,  // Document structure
    /^(?:תנאים רוחביים|במבנה פשוט)/i,  // Document structure
    /^(?:השר|משטרת ישראל).*נותן.*אישור/i  // Document structure
  ];
  
  return structurePatterns.some(pattern => pattern.test(text.trim()));
}

function isMandatory(text) {
  const mandatoryKeywords = [
    "חייב", "חובה", "נדרש", "יש ל", "לא יעלה על", 
    "מינימום", "מקסימום", "צריך", "חייב להיות",
    "יותקן", "יוצב", "יימצא", "יוצג"
  ];
  const forbiddenKeywords = ["אסור", "לא יעשה", "לא מותר"];
  
  // If it contains forbidden keywords, it's not mandatory
  if (forbiddenKeywords.some((keyword) => text.includes(keyword))) {
    return false;
  }
  
  return mandatoryKeywords.some((keyword) => text.includes(keyword));
}
