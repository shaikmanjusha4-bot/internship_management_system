import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService, applicationService } from '../services/api';
import InternshipCard from '../components/InternshipCard';
import Loading from '../components/Loading';
import {
  Briefcase,
  Sparkles,
  FileText,
  Award,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInternships: 0,
    recommendedCount: 0,
    submittedCount: 0,
    shortlistedCount: 0,
    profileCompletion: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [allRes, recRes, appsRes] = await Promise.all([
          internshipService.getAll(),
          internshipService.getRecommended(),
          applicationService.getMyApplications(),
        ]);

        const allInternships = allRes.data?.internships || [];
        const recs = recRes.data?.recommendations || [];
        const apps = appsRes.data?.applications || [];

        // Shortlisted apps count
        const shortlisted = apps.filter(
          (a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
        ).length;

        // Calculate profile completion
        let completionScore = 20; // base for email/name
        if (user?.college) completionScore += 20;
        if (user?.degree) completionScore += 20;
        if (user?.graduationYear) completionScore += 10;
        if (user?.skills && user.skills.length >= 1) completionScore += 15;
        if (user?.skills && user.skills.length >= 4) completionScore += 15;

        setStats({
          totalInternships: allInternships.length,
          recommendedCount: recs.filter((r) => r.skillMatch?.matchPercentage > 0).length,
          submittedCount: apps.length,
          shortlistedCount: shortlisted,
          profileCompletion: Math.min(100, completionScore),
        });

        setRecommendations(recs.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Could not load all dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <Loading message="Loading student dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-3 backdrop-blur-sm">
            🎓 Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-1.5 text-indigo-100 text-sm max-w-xl">
            {user?.skills?.length > 0
              ? `You have ${user.skills.length} active skills. Check out your tailored recommendations below!`
              : 'Add skills to your profile to unlock custom skill match analysis!'}
          </p>
        </div>

        {/* Profile Completion Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[220px] border border-white/20">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span>Profile Completion</span>
            <span className="font-bold">{stats.profileCompletion}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.profileCompletion}%` }}
            ></div>
          </div>
          <Link
            to="/profile"
            className="text-xs text-white/90 hover:text-white underline font-medium block text-right"
          >
            Update Profile & Skills →
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Available Internships */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Available</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalInternships}</p>
            <span className="text-[11px] text-slate-400">Total openings</span>
          </div>
        </div>

        {/* Recommended Internships */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.recommendedCount}</p>
            <span className="text-[11px] text-indigo-600 font-medium">Matching your skills</span>
          </div>
        </div>

        {/* Submitted Applications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applied</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.submittedCount}</p>
            <span className="text-[11px] text-slate-400">Applications sent</span>
          </div>
        </div>

        {/* Shortlisted / Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shortlisted</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.shortlistedCount}</p>
            <span className="text-[11px] text-emerald-600 font-medium">In interview / selected</span>
          </div>
        </div>
      </div>

      {/* Your Top Recommended Internships Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Recommended for Your Skill Set</h2>
          </div>
          <Link
            to="/recommended"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center"
          >
            View all recommended ({stats.recommendedCount})
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                showMatchDetails={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-600 text-sm">
              We couldn't find internships matching your current skills yet.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium"
            >
              Add more skills to your profile
            </Link>
          </div>
        )}
      </section>

      {/* Quick Links Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/internships"
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 text-base">Browse All Internships</h3>
            <p className="text-xs text-slate-500 mt-1">
              Filter by location, stipend, and company requirements.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-600" />
        </Link>

        <Link
          to="/my-applications"
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 text-base">Track Submitted Applications</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check live status updates from recruiters and admins.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-600" />
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
