import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/api';
import InternshipCard from '../components/InternshipCard';
import {
  Sparkles,
  Search,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Target,
  Compass,
  FileCheck,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await internshipService.getAll();
        if (res.data && res.data.internships) {
          setFeaturedInternships(res.data.internships.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/internships?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/internships');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI-Free, Transparent Rule-Based Skill Matching</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Find Internships Based on <span className="text-indigo-600">Your Skills</span> & Bridge Your Skill Gaps
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop blindly applying. Discover which skills match top company roles, see exactly what you are missing, and track your application journey step by step.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white rounded-2xl shadow-md border border-slate-200"
            >
              <div className="flex items-center flex-1 w-full px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by role, company, or skill (e.g. React, Python)..."
                  className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Find Internships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick CTA Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
                >
                  Get Started (Register Free)
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-lg transition-colors"
                >
                  Student / Admin Login
                </Link>
              </>
            ) : isStudent ? (
              <>
                <Link
                  to="/recommended"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors inline-flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Recommended Internships
                </Link>
                <Link
                  to="/student/dashboard"
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/admin/dashboard"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
              >
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Capabilities</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Student Career Success
          </p>
          <p className="mt-3 text-slate-600 text-sm">
            Everything you need to evaluate eligibility, upgrade competencies, and land your dream internship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Skill-Based Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instantly calculates your percentage match against every posted internship using smart rule-based comparison.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Clearly distinguishes matched skills from missing requirements so you know exactly which technologies to learn next.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Internship Search</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Filter openings by specific technologies, locations, stipends, and deadlines to pinpoint ideal opportunities.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Application Tracking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track live progress stages from Applied to Shortlisted, Interview, and Final Selection without guessing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Internships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Openings</h2>
            <p className="text-sm text-slate-500 mt-1">Discover freshly listed internship opportunities</p>
          </div>
          <Link
            to="/internships"
            className="mt-3 sm:mt-0 text-indigo-600 hover:text-indigo-800 text-sm font-semibold inline-flex items-center"
          >
            Explore all internships
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : featuredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm">No internships currently listed. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
