import { findKeywords } from "../utils/keywordFinder.js";
import { extractNumbers } from "../numberExtractor.js";
import { extractStandards } from "../utils/standardsExtractor.js";

/**
 * Process individual section
 */
export function processSection(section, index, categories) {
  // Only process sections that are long enough and contain Hebrew text
  if (section.length < 150) return;
  
  // Skip document structure elements
  if (isDocumentStructure(section)) return;
  
  // Track which sentences have been matched to avoid duplicates
  const matchedSentences = new Set();
  
  Object.keys(categories).forEach((category) => {
    const categoryData = categories[category];
    const foundKeywords = findKeywords(section, categoryData.keywords);

    if (foundKeywords.length > 0) {
      const regulation = extractRegulation(section, foundKeywords, index, category, matchedSentences);
      if (regulation && !isDocumentStructure(regulation.text)) {
        categoryData.regulations.push(regulation);
        // Mark sentences as matched to prevent them from being matched to other categories
        regulation.text.split(/[.!?]/).forEach(sentence => {
          const trimmed = sentence.trim();
          if (trimmed.length > 15) {
            matchedSentences.add(trimmed.toLowerCase());
          }
        });
      }
    }
  });
}

function isDocumentStructure(text) {
  const trimmed = text.trim();
  
  // Must be long enough
  if (trimmed.length < 50) return true;
  
  const structurePatterns = [
    /^[\d\s.,-]+$/,  // Just numbers and punctuation
    /^[\s.,;:!?()-]+$/,  // Just punctuation
    /^[|\-\s]+$/,  // Table separators
    /^\s*[|\-\+\s]\s*$/,  // Single character separators
    /^(?:תוכן עניינים|מפתח|רשימה|טבלה)/i,  // Table of contents
    /^(?:פרק|חלק|סעיף)\s*\d+[א-ת]?\s*$/,  // Just section headers
    /^(?:בית אוכל|מקום הכנה|הגשה של מזון).*למעט עסק.*פריט \d+$/i,  // Document structure
    /^[א-ת]\s*[א-ת]\s*[א-ת]\s*$/,  // Just Hebrew letters
    /^(?:מזון ולרבות|הגשת משקאות).*פריט \d+$/i,  // Document structure
    /^(?:תנאים רוחביים|במבנה פשוט)/i,  // Document structure
    /^(?:השר|משטרת ישראל).*נותן.*אישור/i,  // Document structure
    /^[^\u0590-\u05FF]*$/,  // No Hebrew text
    /^\s*[א-ת]\s*[א-ת]\s*[א-ת]\s*$/,  // Just 3 Hebrew letters
    /^(?:עמוד|Page)\s*\d+$/i,  // Page numbers
    /^(?:תמונה|איור|ציור|טבלה|גרף|דיאגרמה)/i  // Images and tables
  ];
  
  // Check if text matches any structure pattern
  if (structurePatterns.some(pattern => pattern.test(trimmed))) {
    return true;
  }
  
  // Check for table-like content (lines with many separators)
  const lines = trimmed.split('\n');
  const tableLineCount = lines.filter(line => {
    const lineTrimmed = line.trim();
    return /^[|\-\s]+$/.test(lineTrimmed) || 
           /^[\d\s.,-]+$/.test(lineTrimmed) ||
           lineTrimmed.length < 5;
  }).length;
  
  // If more than 40% of lines look like table content, it's likely a table
  if (tableLineCount / lines.length > 0.4) {
    return true;
  }
  
  // No hard regulatory language validation - let categories.js handle filtering
  return false;
}

function extractRegulation(text, keywords, sectionIndex, category, matchedSentences) {
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 15);
  const relevantSentences = [];

  sentences.forEach((sentence) => {
    const trimmed = sentence.trim();
    
    // Skip if sentence is too short or looks like table content
    if (trimmed.length < 15 || isTableContent(trimmed)) {
      return;
    }
    
    // Skip if sentence already matched to another category
    if (matchedSentences.has(trimmed.toLowerCase())) {
      return;
    }
    
    // Check if sentence contains keywords AND is relevant to this specific category
    if (keywords.some((keyword) => new RegExp(keyword, "gi").test(trimmed)) &&
        isRelevantToCategory(trimmed, category)) {
      relevantSentences.push(trimmed);
    }
  });

  if (relevantSentences.length === 0) return null;

  const regulationText = relevantSentences.join(". ").trim();
  
  // Final validation - must contain meaningful regulatory content
  if (!isValidRegulationContent(regulationText)) {
    return null;
  }

  const numbers = extractNumbers(regulationText);
  const standards = extractStandards(regulationText);

  return {
    text: regulationText,
    keywords: keywords,
    numbers: numbers,
    standards: standards,
    sourceSection: sectionIndex,
    extractedAt: new Date().toISOString(),
    category: category
  };
}

function isTableContent(text) {
  const tablePatterns = [
    /^[\d\s.,-]+$/,  // Just numbers and punctuation
    /^[\s.,;:!?()-]+$/,  // Just punctuation
    /^[|\-\s]+$/,  // Table separators
    /^\s*[|\-\+\s]\s*$/,  // Single character separators
    /^[^\u0590-\u05FF]*$/  // No Hebrew text
  ];
  
  return tablePatterns.some(pattern => pattern.test(text));
}

function isRelevantToCategory(sentence, category) {
  const lowerSentence = sentence.toLowerCase();
  
  // Category-specific context validation to ensure sentences are actually relevant
  switch (category) {
    case 'deliveries':
      // Must contain delivery-specific context
      const deliveryContext = ['משלוח', 'הגשה', 'מסירה', 'הובלה', 'רכב', 'מזון מובל', 'שליחת', 'מכלים', 'טמפרטורה', 'בשר', 'דגים', 'עופות'];
      return deliveryContext.some(context => lowerSentence.includes(context)) &&
             (lowerSentence.includes('חייב') || lowerSentence.includes('נדרש') || lowerSentence.includes('צריך') || 
              lowerSentence.includes('מינימום') || lowerSentence.includes('מקסימום') || lowerSentence.includes('יותקן'));
             
    case 'seating':
      // Must contain seating-specific context with numbers or capacity
      const seatingContext = ['ישיבה', 'כיסאות', 'מושבים', 'אורחים', 'קהל', 'תפוסה', 'קיבולת', 'אולם', 'מקומות'];
      return seatingContext.some(context => lowerSentence.includes(context)) &&
             (lowerSentence.includes('חייב') || lowerSentence.includes('נדרש') || lowerSentence.includes('צריך') ||
              /\d+/.test(lowerSentence) || lowerSentence.includes('מינימום') || lowerSentence.includes('מקסימום'));
             
    case 'businessSize':
      // Must contain size/area-specific context with measurements
      const sizeContext = ['מ"ר', 'מטר', 'שטח', 'גודל', 'מידות', 'מטבח', 'מבנה', 'חלל', 'מרחב'];
      return sizeContext.some(context => lowerSentence.includes(context)) &&
             (lowerSentence.includes('חייב') || lowerSentence.includes('נדרש') || lowerSentence.includes('צריך') ||
              /\d+/.test(lowerSentence) || lowerSentence.includes('מינימום') || lowerSentence.includes('מקסימום'));
             
    case 'fireAndGas':
      // Must contain fire/gas safety-specific context
      const fireGasContext = ['אש', 'כיבוי', 'גז', 'גפ"מ', 'בטיחות', 'מתזים', 'מטפה', 'ציוד', 'מערכת', 'ברז', 'זרנוק', 'עמדת', 'גלגלון'];
      return fireGasContext.some(context => lowerSentence.includes(context)) &&
             (lowerSentence.includes('חייב') || lowerSentence.includes('נדרש') || lowerSentence.includes('צריך') ||
              lowerSentence.includes('יותקן') || lowerSentence.includes('יוצב') || lowerSentence.includes('יימצא'));
             
    default:
      return true;
  }
}

function containsRegulatoryLanguage(text) {
  // Always return true - let categories.js handle all filtering logic
  return true;
}

function isValidRegulationContent(text) {
  // Must be long enough
  if (text.length < 50) return false;
  
  // Must contain Hebrew text
  if (!/[\u0590-\u05FF]/.test(text)) return false;
  
  // No hard regulatory language validation - let categories.js handle filtering
  
  // Must not be mostly table content
  const lines = text.split('\n');
  const tableLineCount = lines.filter(line => isTableContent(line.trim())).length;
  
  if (tableLineCount / lines.length > 0.3) return false;
  
  return true;
}
