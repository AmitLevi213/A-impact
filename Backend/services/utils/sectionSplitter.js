/**
 * Split text into logical sections
 */
export function splitIntoSections(text) {
  // Split by more specific regulatory patterns
  const sectionPatterns = [
    // Split by actual regulation sections
    /(?:פרק|חלק|סעיף|תקנה)\s*\d+[א-ת]?\s*[–-]\s*/gi,
    // Split by specific regulatory content markers
    /(?:דרישות|הוראות|תנאים|הגבלות)\s*(?:בטיחות|תברואה|מבנה|ציוד|מטבח|משלוח|ישיבה)/gi,
    // Split by mandatory requirement patterns
    /(?:חובה|נדרש|יש ל|צריך)\s*(?:להתקין|לספק|לוודא|לבצע|להיות|להתקיים)/gi
  ];
  
  let sections = [text];
  
  // Apply each pattern to further split the text
  sectionPatterns.forEach(pattern => {
    const newSections = [];
    sections.forEach(section => {
      const parts = section.split(pattern);
      newSections.push(...parts);
    });
    sections = newSections;
  });

  return sections.filter(
    (section) => {
      const trimmed = section.trim();
      return isValidRegulatorySection(trimmed);
    }
  );
}

function isValidRegulatorySection(text) {
  const trimmed = text.trim();
  
  // Must be long enough and contain Hebrew
  if (trimmed.length < 150 || !containsHebrewText(trimmed)) {
    return false;
  }
  
  // Filter out document structure elements
  const structurePatterns = [
    /^[\d\s.,-]+$/,  // Just numbers and punctuation
    /^[\s.,;:!?()-]+$/,  // Just punctuation
    /^(?:תוכן עניינים|מפתח|רשימה|טבלה)/i,  // Table of contents
    /^(?:פרק|חלק|סעיף)\s*\d+[א-ת]?\s*$/,  // Just section headers
    /^[א-ת]\s*[א-ת]\s*[א-ת]\s*$/,  // Just Hebrew letters
    /^(?:בית אוכל|מקום הכנה|הגשה של מזון).*למעט עסק.*פריט \d+$/i  // Document structure
  ];
  
  // Reject if matches any structure pattern
  if (structurePatterns.some(pattern => pattern.test(trimmed))) {
    return false;
  }
  
  // No hard validation - let categories.js handle all filtering logic
  return true;
}

function containsHebrewText(text) {
  const hebrewPattern = /[\u0590-\u05FF]/;
  return hebrewPattern.test(text);
}

function isJustNumbers(text) {
  return /^[\d\s.,-]+$/.test(text);
}

function isJustPunctuation(text) {
  return /^[\s.,;:!?()-]+$/.test(text);
}
