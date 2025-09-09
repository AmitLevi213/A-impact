import { findKeywords } from "../utils/keywordFinder.js";
import { extractNumbers } from "../numberExtractor.js";
import { extractStandards } from "../utils/standardsExtractor.js";

/**
 * Process individual section
 */
export function processSection(section, index, categories) {
  Object.keys(categories).forEach((category) => {
    const categoryData = categories[category];
    const foundKeywords = findKeywords(section, categoryData.keywords);

    if (foundKeywords.length > 0) {
      const regulation = extractRegulation(section, foundKeywords, index);
      if (regulation) {
        categoryData.regulations.push(regulation);
      }
    }
  });
}

function extractRegulation(text, keywords, sectionIndex) {
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
  };
}
