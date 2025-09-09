/**
 * Calculate importance score
 */
export function calculateImportance(regulation) {
  let score = 0;

  score += regulation.keywords.length;
  score += regulation.numbers.length * 2;
  score += regulation.standards.length * 3;
  if (regulation.text.length > 200) score += 2;

  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
}
