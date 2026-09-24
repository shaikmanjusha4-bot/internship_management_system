import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import Loading from '../components/Loading';
import SkillMatch from '../components/SkillMatch';
import {
  FileCheck2,
  Search,
  Filter,
  User,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
];

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null); // For modal/detail inspection
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await applicationService.getAllApplications(params);
      setApplications(res.data?.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setMessage({ type: 'error', text: 'Failed to fetch applications.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      setMessage({ type: '', text: '' });
      const res = await applicationService.updateStatus(appId, newStatus);
      if (res.data && res.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
        setMessage({
          type: 'success',
          text: `Application status updated to "${newStatus}"`,
        });
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update status',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const studentName = app.student?.name?.toLowerCase() || '';
    const studentEmail = app.student?.email?.toLowerCase() || '';
    const internshipTitle = app.internship?.title?.toLowerCase() || '';
    const company = app.internship?.company?.toLowerCase() || '';
    return (
      studentName.includes(q) ||
      studentEmail.includes(q) ||
      internshipTitle.includes(q) ||
      company.includes(q)
    );
  });

  if (loading && applications.length === 0) {
    return <Loading message="Loading applicant records..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Applications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review student profiles, compare skill match scores, and update candidate hiring stages.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center space-x-2 border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, email, internship title, or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter Status:
          </span>
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Student Candidate</th>
                <th className="py-3.5 px-4">College & Degree</th>
                <th className="py-3.5 px-4">Applied Internship</th>
                <th className="py-3.5 px-4">Skill Match Analysis</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((app) => {
                  const matchPct = app.skillMatch?.matchPercentage || 0;
                  const isUpdating = updatingId === app._id;

                  return (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {app.student?.name || 'Unknown Student'}
                        </div>
                        <div className="text-slate-500 text-[11px]">{app.student?.email}</div>
                      </td>

                      {/* College & Degree */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {app.student?.college || 'Not specified'}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {app.student?.degree}
                          {app.student?.graduationYear ? ` ('${app.student.graduationYear})` : ''}
                        </div>
                      </td>

                      {/* Internship */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {app.internship?.title || 'Unknown Position'}
                        </div>
                        <div className="text-indigo-600 font-medium text-[11px]">
                          {app.internship?.company}
                        </div>
                      </td>

                      {/* Skill Match */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              matchPct >= 75
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : matchPct >= 40
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {matchPct}% Match
                          </span>
                          <div className="text-[11px] text-slate-500">
                            Matched: {app.skillMatch?.matchedSkills?.length || 0} | Missing:{' '}
                            {app.skillMatch?.missingSkills?.length || 0}
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isUpdating}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`font-semibold rounded-lg text-xs px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                            app.status === 'Selected'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : app.status === 'Shortlisted' || app.status === 'Interview'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              : 'bg-white text-slate-700'
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                    No applications match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Detail Inspection Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Applicant Profile
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedApp.student?.name}
                </h2>
                <p className="text-xs text-slate-500">{selectedApp.student?.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Academic details */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <p className="font-semibold text-slate-500">College</p>
                <p className="font-bold text-slate-800">{selectedApp.student?.college || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500">Degree & Year</p>
                <p className="font-bold text-slate-800">
                  {selectedApp.student?.degree || 'N/A'} (Class of {selectedApp.student?.graduationYear || 'N/A'})
                </p>
              </div>
            </div>

            {/* Student's Full Skills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Candidate Skills Inventory:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.student?.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Match Breakdown */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Match Against "{selectedApp.internship?.title}":
              </p>
              <SkillMatch skillMatch={selectedApp.skillMatch} />
            </div>

            {/* Update Status In Modal */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                  className="rounded-lg text-xs font-semibold px-3 py-1.5 border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
