import { extractRequirements } from "../utils/requirementExtractor.js";
import { calculateImportance } from "../utils/importanceCalculator.js";

export function finalizeData(categories, processedData) {
  let totalRegulations = 0;

  Object.keys(categories).forEach((category) => {
    const regulations = categories[category].regulations;
    console.log(`Processing ${category}: ${regulations.length} raw regulations found`);
    
    // Process each regulation to extract proper sub-regulations
    const processedRegulations = regulations.map((reg) => {
      const requirements = extractRequirements(reg);
      
      // Use the extracted requirements directly
      reg.enhancedRequirements = requirements;
      
      // Ensure exactly 2 sub-regulations (pad with general requirements if needed, or trim if more)
      reg.enhancedRequirements = ensureExactlyTwoRequirements(reg.enhancedRequirements, reg.text);
      
      return reg;
    });

    // All processed regulations now have exactly 2 sub-regulations
    const validRegulations = processedRegulations.filter((reg) => {
      return reg.enhancedRequirements && reg.enhancedRequirements.length > 0;
    });

    // Limit to maximum 2 regulations per category
    const limitedRegulations = validRegulations.slice(0, 2);

    console.log(`${category}: ${limitedRegulations.length} regulations (limited to max 2)`);

    processedData[category] = limitedRegulations.map((reg) => ({
      id: `${category}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      category,
      title: generateTitle(reg, category),
      content: reg.text,
      requirements: reg.enhancedRequirements || extractRequirements(reg),
      standards: reg.standards,
      numbers: reg.numbers,
      sourceReference: `Section ${reg.sourceSection}`,
      keywords: reg.keywords,
      importance: calculateImportance(reg),
      extractedAt: reg.extractedAt,
    }));

    totalRegulations += limitedRegulations.length;
  });

  processedData.metadata.totalRegulations = totalRegulations;
  console.log(`Total valid regulations: ${totalRegulations}`);
}



function ensureExactlyTwoRequirements(requirements, originalText) {
  if (requirements.length === 2) {
    return requirements;
  }
  
  if (requirements.length > 2) {
    // Take the first 2 most important requirements
    return requirements.slice(0, 2);
  }
  
  // If less than 2, pad with general requirements
  const paddedRequirements = [...requirements];
  const generalRequirements = [
    "העסק חייב לעמוד בכל התקנות החלות",
    "נדרשות בדיקות תקופתיות לוודא עמידה בתקנות"
  ];
  
  let generalIndex = 0;
  while (paddedRequirements.length < 2 && generalIndex < generalRequirements.length) {
    paddedRequirements.push({
      text: generalRequirements[generalIndex],
      type: "general",
      mandatory: true
    });
    generalIndex++;
  }
  
  return paddedRequirements;
}

function generateTitle(regulation, category) {
  const titles = {
    deliveries: "Delivery Requirements",
    seating: "Seating Requirements",
    businessSize: "Business Size Requirements",
    fireAndGas: "Fire and Gas Safety Requirements",
  };

  let title = titles[category] || "General Requirements";

  if (regulation.numbers.length > 0) {
    const firstNumber = regulation.numbers[0];
    title += ` - ${firstNumber.value} ${firstNumber.unit}`;
  }

  return title;
}
