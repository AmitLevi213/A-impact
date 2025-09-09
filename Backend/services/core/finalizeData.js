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
      
      // If we have less than 6 requirements, try to extract more from the text
      if (requirements.length < 6) {
        const enhancedRequirements = extractMoreRequirements(reg.text, requirements);
        reg.enhancedRequirements = enhancedRequirements;
      } else {
        reg.enhancedRequirements = requirements;
      }
      
      // Ensure exactly 6 sub-regulations (pad with general requirements if needed, or trim if more)
      reg.enhancedRequirements = ensureExactlySixRequirements(reg.enhancedRequirements, reg.text);
      
      return reg;
    });

    // All processed regulations now have exactly 6 sub-regulations
    const validRegulations = processedRegulations.filter((reg) => {
      return reg.enhancedRequirements && reg.enhancedRequirements.length > 0;
    });

    // Limit to maximum 6 regulations per category
    const limitedRegulations = validRegulations.slice(0, 6);

    console.log(`${category}: ${limitedRegulations.length} regulations (limited to max 6)`);

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

function extractMoreRequirements(text, existingRequirements) {
  const requirements = [...existingRequirements];
  
  // Try to find more requirements by splitting on different patterns
  const patterns = [
    /[.!?]\s*(?=[א-ת])/g,  // Split on sentence endings
    /[;]\s*(?=[א-ת])/g,     // Split on semicolons
    /,\s*(?=[א-ת])/g,       // Split on commas
    /\)\s*(?=[א-ת])/g,      // Split after closing parentheses
    /\d+\.\s*(?=[א-ת])/g,   // Split after numbered items
    /-\s*(?=[א-ת])/g,       // Split on dashes
  ];
  
  for (const pattern of patterns) {
    const parts = text.split(pattern).filter(part => part.trim().length > 10);
    
    parts.forEach(part => {
      const cleanPart = part.trim();
      if (cleanPart.length > 15 && cleanPart.length < 200) {
        // Check if this part contains requirement keywords
        const hasRequirementKeywords = /חייב|חובה|נדרש|יש ל|צריך|רשאי|יכול|אסור|לא יעשה|מינימום|מקסימום|יותקן|יוצב|יימצא/.test(cleanPart);
        
        if (hasRequirementKeywords && !requirements.some(req => req.text === cleanPart)) {
          requirements.push({
            text: cleanPart,
            type: classifyRequirement(cleanPart),
            mandatory: isMandatory(cleanPart),
          });
        }
      }
    });
    
    // If we have enough requirements, break
    if (requirements.length >= 6) break;
  }
  
  return requirements;
}

function classifyRequirement(text) {
  if (/חייב|חובה/.test(text)) return "mandatory";
  if (/רשאי|יכול/.test(text)) return "optional";
  if (/אסור|לא יעשה/.test(text)) return "forbidden";
  return "general";
}

function isMandatory(text) {
  const mandatoryKeywords = [
    "חייב", "חובה", "נדרש", "יש ל", "לא יעלה על", 
    "מינימום", "מקסימום", "צריך", "חייב להיות",
    "יותקן", "יוצב", "יימצא", "יוצג"
  ];
  const forbiddenKeywords = ["אסור", "לא יעשה", "לא מותר"];
  
  // If it contains forbidden keywords, it's not mandatory
  if (forbiddenKeywords.some((keyword) => text.includes(keyword))) {
    return false;
  }
  
  return mandatoryKeywords.some((keyword) => text.includes(keyword));
}

function ensureExactlySixRequirements(requirements, originalText) {
  if (requirements.length === 6) {
    return requirements;
  }
  
  if (requirements.length > 6) {
    // Take the first 6 most important requirements
    return requirements.slice(0, 6);
  }
  
  // If less than 6, pad with general requirements
  const paddedRequirements = [...requirements];
  const generalRequirements = [
    "The business must comply with all applicable regulations",
    "Regular inspections are required to ensure compliance",
    "Documentation must be maintained for all activities",
    "Safety measures must be implemented and maintained",
    "Staff must be properly trained on all procedures",
    "Equipment must be properly maintained and serviced"
  ];
  
  let generalIndex = 0;
  while (paddedRequirements.length < 6 && generalIndex < generalRequirements.length) {
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
