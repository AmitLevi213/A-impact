/**
 * Extract numerical values
 */
export function extractNumbers(text) {
  const numbers = [];
  let match;

  const meterPattern = /(\d+)\s*מ["']ר/g;
  while ((match = meterPattern.exec(text)) !== null) {
    numbers.push({ value: parseInt(match[1]), unit: 'מ"ר', context: "שטח" });
  }

  const peoplePattern = /(\d+)\s*איש/g;
  while ((match = peoplePattern.exec(text)) !== null) {
    numbers.push({ value: parseInt(match[1]), unit: "איש", context: "תפוסה" });
  }

  const seatingPattern = /(\d+)\s*מקומות\s*ישיבה/g;
  while ((match = seatingPattern.exec(text)) !== null) {
    numbers.push({
      value: parseInt(match[1]),
      unit: "מקומות ישיבה",
      context: "ישיבה",
    });
  }

  return numbers;
}
