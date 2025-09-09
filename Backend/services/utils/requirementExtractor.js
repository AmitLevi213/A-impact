export function extractRequirements(regulation) {
  const requirements = [];
  const text = regulation.text;

  const obligationPatterns = [
    /חייב|נדרש|יש ל|חובה|בהתאם ל/g,
    /לא יעלה על|לא פחות מ|מינימום/g,
    /יותקן|יוצב|יימצא/g,
  ];

  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 5);

  sentences.forEach((sentence) => {
    if (obligationPatterns.some((pattern) => pattern.test(sentence))) {
      requirements.push({
        text: sentence.trim(),
        type: classifyRequirement(sentence),
        mandatory: isMandatory(sentence),
      });
    }
  });

  return requirements;
}

function classifyRequirement(text) {
  if (/חייב|חובה/.test(text)) return "mandatory";
  if (/רשאי|יכול/.test(text)) return "optional";
  if (/אסור|לא יעשה/.test(text)) return "forbidden";
  return "general";
}

function isMandatory(text) {
  const mandatoryKeywords = ["חייב", "חובה", "נדרש", "יש ל", "לא יעלה על"];
  return mandatoryKeywords.some((keyword) => text.includes(keyword));
}
