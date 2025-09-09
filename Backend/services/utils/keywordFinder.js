/**
 * Find keywords in text
 */
export function findKeywords(text, keywords) {
  return keywords.filter((keyword) => {
    const pattern = new RegExp(keyword, "gi");
    return pattern.test(text);
  });
}
