import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/api';
import InternshipCard from '../components/InternshipCard';
import Loading from '../components/Loading';
import { Sparkles, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const RecommendedInternships = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await internshipService.getRecommended();
        setRecommendations(res.data?.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to compute internship recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return <Loading message="Analyzing your skills and generating recommendations..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Career Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recommended Internships
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Ranked by percentage compatibility with your listed skills. Roles with the highest overlap appear first.
          </p>
        </div>

        {/* Current Student Skills pill box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 max-w-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider">
              Your Active Skills ({user?.skills?.length || 0})
            </span>
            <Link to="/profile" className="text-indigo-600 hover:underline font-semibold">
              Edit Skills →
            </Link>
          </div>
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {recommendations.length} Recommended {recommendations.length === 1 ? 'Opportunity' : 'Opportunities'} Found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                showMatchDetails={true}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching internships found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Add more in-demand skills (such as React, Python, Node.js, SQL, or MongoDB) to your profile
            to see recommendations.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            <span>Update Profile Skills</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedInternships;
