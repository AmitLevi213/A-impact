/**
 * Clean Hebrew text and remove unwanted characters
 */
export function cleanHebrewText(text) {
  return text
    .replace(/\s+/g, " ") // Remove excessive whitespace
    .replace(/^\d+\s*/gm, "") // Remove page numbers
    .replace(/[\u200E\u200F\u202A-\u202E]/g, "") // Remove RTL marks
    .replace(/[""'']/g, '"')
    .replace(/[–—]/g, "-")
    .trim();
}
