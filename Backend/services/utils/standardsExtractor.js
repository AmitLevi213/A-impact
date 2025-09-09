/**
 * Extract Israeli standards references
 */
export function extractStandards(text) {
  const standards = [];
  const standardPattern = /ת["']י\s*(\d+)(?:\.(\d+))?/g;

  let match;
  while ((match = standardPattern.exec(text)) !== null) {
    standards.push({
      standard: `ת"י ${match[1]}${match[2] ? "." + match[2] : ""}`,
      context: getStandardContext(text, match.index),
    });
  }

  return standards;
}

function getStandardContext(text, index) {
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + 100);
  return text.substring(start, end).trim();
}
