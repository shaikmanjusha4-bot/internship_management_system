import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService, applicationService } from '../services/api';
import SkillMatch from '../components/SkillMatch';
import Loading from '../components/Loading';
import {
  MapPin,
  Clock,
  Banknote,
  Calendar,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Send,
  Edit,
  Lock,
} from 'lucide-react';

const InternshipDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await internshipService.getById(id);
      if (res.data && res.data.internship) {
        setInternship(res.data.internship);
      }
    } catch (err) {
      console.error('Error fetching internship details:', err);
      setError('Failed to load internship details or internship does not exist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/internships/${id}` } } });
      return;
    }

    if (!isStudent) {
      setError('Only students can apply for internships.');
      return;
    }

    try {
      setApplying(true);
      setError('');
      const res = await applicationService.apply(id);
      if (res.data && res.data.success) {
        setApplySuccess('Congratulations! Your application has been submitted successfully.');
        setInternship((prev) => ({
          ...prev,
          hasApplied: true,
          applicationStatus: 'Applied',
        }));
      }
    } catch (err) {
      console.error('Apply error:', err);
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loading message="Loading internship details..." />;
  }

  if (error && !internship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl mb-4">
          <p className="font-semibold">{error}</p>
        </div>
        <Link to="/internships" className="text-indigo-600 font-semibold text-sm hover:underline">
          ← Back to All Internships
        </Link>
      </div>
    );
  }

  const {
    title,
    company,
    description,
    location,
    duration,
    stipend,
    eligibility,
    requiredSkills = [],
    applicationDeadline,
    skillMatch,
    hasApplied,
    applicationStatus,
  } = internship;

  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Ongoing';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/internships"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to all internships
        </Link>
      </div>

      {applySuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{applySuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Internship Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md">
              {company}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>

            {/* Quick Metadata tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 pt-2">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Banknote className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{stipend}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Deadline: {formattedDeadline}</span>
              </div>
            </div>
          </div>

          {/* Action Button Section */}
          <div className="flex flex-col items-start md:items-end justify-center gap-3">
            {isAdmin ? (
              <Link
                to={`/admin/internships/edit/${id}`}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Internship</span>
              </Link>
            ) : hasApplied ? (
              <div className="text-right">
                <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Status: {applicationStatus || 'Applied'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  You have already applied for this position.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-60"
              >
                {applying ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Skill Match & Gap Analysis vs Internship Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Description & Eligibility (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              About the Internship
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Eligibility & Academic Criteria</span>
            </h2>
            <p className="text-sm text-slate-700">{eligibility}</p>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Match & Gap Analysis (1 col) */}
        <div className="space-y-6">
          {isAuthenticated && isStudent ? (
            <div className="sticky top-20">
              <SkillMatch skillMatch={skillMatch} />
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-700 mb-1">💡 How is this calculated?</p>
                <p>
                  Our rule-based engine compares your profile's skills with this role's requirements
                  and highlights exactly what skills to improve before interviews.
                </p>
                <Link
                  to="/profile"
                  className="text-indigo-600 hover:underline font-semibold block mt-2"
                >
                  Update your skills list →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Check Your Skill Match</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign in as a student to see your real-time skill match percentage and identify missing skill gaps.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Sign In to Check Match
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Create Student Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
