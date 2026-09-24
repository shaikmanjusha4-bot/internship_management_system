import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const SkillMatch = ({ skillMatch, compact = false, showHeader = true }) => {
  if (!skillMatch) return null;

  const { matchPercentage = 0, matchedSkills = [], missingSkills = [] } = skillMatch;

  // Determine color theme based on score
  const getBadgeColor = (pct) => {
    if (pct >= 75) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500' };
    if (pct >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', bar: 'bg-rose-500' };
  };

  const theme = getBadgeColor(matchPercentage);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.bg} ${theme.text} ${theme.border}`}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {matchPercentage}% Skill Match
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-base">Skill Match & Gap Analysis</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
            {matchPercentage}% Match
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
          <span>Overall Compatibility</span>
          <span>{matchPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${theme.bar}`}
            style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}
          ></div>
        </div>
      </div>

      {/* Matched Skills */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Matched Skills ({matchedSkills.length})</span>
        </div>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <span className="mr-1 text-emerald-600 font-bold">✓</span>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No matching skills yet. Add more skills to your profile!</p>
        )}
      </div>

      {/* Missing Skills / Skill Gaps */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Skills to Improve / Skill Gaps ({missingSkills.length})</span>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
              >
                <span className="mr-1 text-amber-600 font-bold">⚠</span>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 font-medium flex items-center">
            <span className="mr-1">🎉</span> You meet all the required skills for this internship!
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillMatch;
