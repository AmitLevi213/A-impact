/**
 * Clean Hebrew text and remove unwanted characters, tables, and irrelevant content
 */
export function cleanHebrewText(text) {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, " ")
    
    // Remove page numbers and headers
    .replace(/^\d+\s*/gm, "")
    .replace(/^עמוד\s+\d+/gm, "")
    .replace(/^Page\s+\d+/gm, "")
    
    // Remove RTL marks and formatting
    .replace(/[\u200E\u200F\u202A-\u202E]/g, "")
    .replace(/[""'']/g, '"')
    .replace(/[–—]/g, "-")
    
    // Remove table-like content (lines with many separators)
    .replace(/^[|\-\s]+$/gm, "")
    .replace(/^[+\-\s]+$/gm, "")
    .replace(/^\s*[|\-\s]+\s*$/gm, "")
    
    // Remove single character lines (often table separators)
    .replace(/^\s*[|\-\+\s]\s*$/gm, "")
    
    // Remove lines that are mostly numbers or symbols
    .replace(/^[\d\s\-\+\.\,]+$/gm, "")
    .replace(/^[\s\-\+\.\,]+$/gm, "")
    
    // Remove very short lines (likely table fragments)
    .replace(/^\s*.{1,3}\s*$/gm, "")
    
    // Remove lines with only punctuation
    .replace(/^[\s\-\+\.\,\:\;\!\?\(\)\[\]\{\}]+$/gm, "")
    
    // Remove common table headers and footers
    .replace(/^[^\u0590-\u05FF]*$/gm, "") // Remove lines without Hebrew
    .replace(/^[\s\d\-\+\.\,]+$/gm, "") // Remove numeric-only lines
    
    // Remove empty lines
    .replace(/^\s*$/gm, "")
    
    // Clean up multiple newlines
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    
    .trim();
}
