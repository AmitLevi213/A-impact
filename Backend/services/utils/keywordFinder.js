/**
 * Find keywords in text with context validation
 */
export function findKeywords(text, keywords) {
  // Clean the text first
  const cleanText = text
    .replace(/\s+/g, " ")
    .replace(/[^\u0590-\u05FF\s\d\.,;:!?()-]/g, "")
    .trim();

  return keywords.filter((keyword) => {
    const pattern = new RegExp(keyword, "gi");
    const matches = pattern.test(cleanText);
    
    // Additional validation for better relevance
    if (matches) {
      return isValidKeywordMatch(cleanText, keyword);
    }
    
    return false;
  });
}

function isValidKeywordMatch(text, keyword) {
  // Check if keyword appears in meaningful context
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
  
  if (keywordIndex === -1) return false;
  
  // Get context around the keyword (50 characters before and after)
  const start = Math.max(0, keywordIndex - 50);
  const end = Math.min(text.length, keywordIndex + keyword.length + 50);
  const context = text.substring(start, end);
  
  // Check if context contains regulatory language
  const regulatoryContext = [
    'חובה', 'נדרש', 'יש ל', 'צריך', 'חייב', 'אסור', 'לא יעשה',
    'מינימום', 'מקסימום', 'לפחות', 'לא יותר', 'לא פחות',
    'יותקן', 'יוצב', 'יימצא', 'יוצג', 'יוכן', 'יוחזק',
    'בטיחות', 'תברואה', 'מבנה', 'ציוד', 'מטבח', 'משלוח',
    'ישיבה', 'אש', 'גז', 'שטח', 'מידות', 'מקום', 'מ"ר',
    'איש', 'מקומות', 'תפוסה', 'קיבולת', 'גודל'
  ];
  
  // Must contain at least one regulatory context word
  return regulatoryContext.some(contextWord => 
    context.toLowerCase().includes(contextWord.toLowerCase())
  );
}
