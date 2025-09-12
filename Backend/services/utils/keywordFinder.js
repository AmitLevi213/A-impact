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
  // Check if keyword exists in text with proper word boundaries for better matching
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (keywordIndex === -1) return false;
  
  // For short generic keywords, require more specific context
  if (keyword.length <= 3) {
    // Short keywords like "גז", "אש" need stronger context validation
    const context = text.substring(Math.max(0, keywordIndex - 20), keywordIndex + keyword.length + 20);
    const strongContextWords = ['חייב', 'נדרש', 'צריך', 'בטיחות', 'כיבוי', 'מערכת', 'ציוד'];
    return strongContextWords.some(word => context.toLowerCase().includes(word));
  }
  
  return true;
}
