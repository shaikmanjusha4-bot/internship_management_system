import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService, internshipService } from '../services/api';
import Loading from '../components/Loading';
import {
  Users,
  Briefcase,
  FileCheck2,
  Award,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    totalApplications: 0,
    selectedStudents: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await applicationService.getStats();
        if (res.data && res.data.success) {
          setStats(res.data.stats);
          setRecentApplications(res.data.recentApplications || []);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to fetch admin dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <Loading message="Loading admin dashboard statistics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            🛡️ Administrator Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Monitor student engagement, oversee internship postings, and review candidates' skill match scores.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/internships/add"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Internship</span>
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors border border-white/10 inline-flex items-center space-x-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Manage Applications</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Students</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalStudents}</p>
            <span className="text-[11px] text-slate-400">Registered candidates</span>
          </div>
        </div>

        {/* Total Internships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Internships</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalInternships}</p>
            <span className="text-[11px] text-indigo-600 font-medium">Active postings</span>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applications</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalApplications}</p>
            <span className="text-[11px] text-slate-400">Submitted in system</span>
          </div>
        </div>

        {/* Selected Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selected</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.selectedStudents}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Placed applicants</span>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Student Applications</h2>
            <p className="text-xs text-slate-500">Latest applicant submissions with calculated skill match scores</p>
          </div>
          <Link
            to="/admin/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center"
          >
            View all applications ({stats.totalApplications})
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Student Candidate</th>
                  <th className="py-3 px-4">Internship Role</th>
                  <th className="py-3 px-4">Skill Match %</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApplications.map((app) => {
                  const matchPct = app.skillMatch?.matchPercentage || 0;
                  return (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{app.student?.name || 'Unknown Student'}</div>
                        <div className="text-slate-400 text-[11px]">{app.student?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.internship?.title || 'Unknown Role'}</div>
                        <div className="text-slate-400 text-[11px]">{app.internship?.company}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            matchPct >= 75
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : matchPct >= 40
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {matchPct}% Match
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/admin/applications"
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Review & Update
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center italic">
            No applications received yet.
          </p>
        )}
      </div>

      {/* Quick Admin Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/internships"
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Manage All Internships</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add new postings, edit requirements, or delete outdated listings.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </Link>

        <Link
          to="/admin/applications"
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Review All Applications</h3>
            <p className="text-xs text-slate-500 mt-1">
              Filter by status, view applicant skill gaps, and advance candidate stages.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
