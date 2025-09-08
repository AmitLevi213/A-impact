export const getBusinessRequirements = (req, res) => {
  const { size, seating, gas } = req.body;

  let requirements = ["רישיון עסק כללי"];

  if (size > 100) {
    requirements.push("אישור כיבוי אש לעסק גדול");
  }

  if (seating > 50) {
    requirements.push("אישור משרד הבריאות לעסקי מזון עם תפוסה גבוהה");
  }

  if (gas) {
    requirements.push("אישור שימוש בגז");
  }

  res.json({
    requirements,
  });
};
