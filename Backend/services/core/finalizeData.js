import { extractRequirements } from "../utils/requirementExtractor.js";
import { calculateImportance } from "../utils/importanceCalculator.js";

export function finalizeData(categories, processedData) {
  let totalRegulations = 0;

  Object.keys(categories).forEach((category) => {
    const regulations = categories[category].regulations;
    processedData[category] = regulations.map((reg) => ({
      id: `${category}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      category,
      title: generateTitle(reg, category),
      content: reg.text,
      requirements: extractRequirements(reg),
      standards: reg.standards,
      numbers: reg.numbers,
      sourceReference: `Section ${reg.sourceSection}`,
      keywords: reg.keywords,
      importance: calculateImportance(reg),
      extractedAt: reg.extractedAt,
    }));

    totalRegulations += regulations.length;
  });

  processedData.metadata.totalRegulations = totalRegulations;
}

function generateTitle(regulation, category) {
  const titles = {
    deliveries: "דרישות משלוחים",
    seating: "דרישות מקומות ישיבה",
    businessSize: "דרישות גודל עסק",
    fireAndGas: "דרישות בטיחות אש וגז",
  };

  let title = titles[category] || "דרישה כללית";

  if (regulation.numbers.length > 0) {
    const firstNumber = regulation.numbers[0];
    title += ` - ${firstNumber.value} ${firstNumber.unit}`;
  }

  return title;
}
