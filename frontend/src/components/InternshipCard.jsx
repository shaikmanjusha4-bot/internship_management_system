import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Banknote, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import SkillMatch from './SkillMatch';

const InternshipCard = ({ internship, showMatchDetails = false }) => {
  const {
    _id,
    title,
    company,
    location,
    duration,
    stipend,
    requiredSkills = [],
    applicationDeadline,
    skillMatch,
    hasApplied,
    applicationStatus,
  } = internship;

  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges & Company */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {company}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasApplied && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                {applicationStatus || 'Applied'}
              </span>
            )}
            {skillMatch !== undefined && <SkillMatch skillMatch={skillMatch} compact={true} />}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          <Link to={`/internships/${_id}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Banknote className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{stipend}</span>
          </div>
          {formattedDeadline && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Ends {formattedDeadline}</span>
            </div>
          )}
        </div>

        {/* Required Skills */}
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 mb-1.5">Required Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md"
              >
                {skill}
              </span>
            ))}
            {requiredSkills.length > 5 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-md">
                +{requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Detailed Skill Match Breakdown if requested */}
        {showMatchDetails && skillMatch && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <SkillMatch skillMatch={skillMatch} showHeader={false} />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/internships/${_id}`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold inline-flex items-center transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>

        <Link
          to={`/internships/${_id}`}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            hasApplied
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {hasApplied ? 'View Application' : 'Apply Now'}
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard;
