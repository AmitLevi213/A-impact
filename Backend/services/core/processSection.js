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
  
  Object.keys(categories).forEach((category) => {
    const categoryData = categories[category];
    const foundKeywords = findKeywords(section, categoryData.keywords);

    if (foundKeywords.length > 0) {
      const regulation = extractRegulation(section, foundKeywords, index, category);
      if (regulation && !isDocumentStructure(regulation.text)) {
        categoryData.regulations.push(regulation);
      }
    }
  });
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

function extractRegulation(text, keywords, sectionIndex, category) {
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 10);
  const relevantSentences = [];

  sentences.forEach((sentence) => {
    if (keywords.some((keyword) => new RegExp(keyword, "gi").test(sentence))) {
      relevantSentences.push(sentence.trim());
    }
  });

  if (relevantSentences.length === 0) return null;

  const numbers = extractNumbers(relevantSentences.join(" "));
  const standards = extractStandards(relevantSentences.join(" "));

  return {
    text: relevantSentences.join(". ").trim(),
    keywords: keywords,
    numbers: numbers,
    standards: standards,
    sourceSection: sectionIndex,
    extractedAt: new Date().toISOString(),
    category: category
  };
}
