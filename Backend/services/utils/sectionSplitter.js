/**
 * Split text into logical sections
 */
export function splitIntoSections(text) {
  const sectionPattern =
    /(?:פרק|חלק|סעיף|תקנה)\s*\d+|(?:מטבח|משלוח|ישיבה|אש|גז|שטח)/gi;
  const sections = text.split(sectionPattern);

  return sections.filter(
    (section) => section.trim().length > 50 && containsHebrewText(section)
  );
}

function containsHebrewText(text) {
  const hebrewPattern = /[\u0590-\u05FF]/;
  return hebrewPattern.test(text);
}
