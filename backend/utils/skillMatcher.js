/**
 * Skill Matcher Utility
 * Compares student skills against internship required skills
 * Case-insensitive, trims whitespace, prevents duplicates.
 *
 * @param {Array<string>} studentSkills - Array of skills from the student profile
 * @param {Array<string>} requiredSkills - Array of skills required by the internship
 * @returns {Object} { matchPercentage, matchedSkills, missingSkills }
 */
const calculateSkillMatch = (studentSkills = [], requiredSkills = []) => {
  // Normalize and deduplicate student skills
  const studentSkillSet = new Set(
    (studentSkills || [])
      .filter((s) => typeof s === 'string' && s.trim().length > 0)
      .map((s) => s.trim().toLowerCase())
  );

  // Normalize and deduplicate required skills, preserving canonical display names
  const uniqueRequiredMap = new Map();
  (requiredSkills || []).forEach((skill) => {
    if (typeof skill === 'string' && skill.trim().length > 0) {
      const lower = skill.trim().toLowerCase();
      if (!uniqueRequiredMap.has(lower)) {
        uniqueRequiredMap.set(lower, skill.trim());
      }
    }
  });

  const uniqueRequiredEntries = Array.from(uniqueRequiredMap.entries());

  if (uniqueRequiredEntries.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  uniqueRequiredEntries.forEach(([lower, displayName]) => {
    if (studentSkillSet.has(lower)) {
      matchedSkills.push(displayName);
    } else {
      missingSkills.push(displayName);
    }
  });

  const matchPercentage = Math.round(
    (matchedSkills.length / uniqueRequiredEntries.length) * 100
  );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  calculateSkillMatch,
};
