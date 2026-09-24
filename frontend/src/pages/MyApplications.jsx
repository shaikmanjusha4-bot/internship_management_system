import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/api';
import Loading from '../components/Loading';
import {
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await applicationService.getMyApplications();
        setApplications(res.data?.applications || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyApps();
  }, []);

  if (loading) {
    return <Loading message="Loading your submitted applications..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track real-time recruitment progression from submission to final offer selection.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const { _id, internship, status, appliedAt, skillMatch } = app;
            const currentStageIndex = STAGES.indexOf(status);
            const isRejected = status === 'Rejected';

            const formattedDate = appliedAt
              ? new Date(appliedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A';

            return (
              <div
                key={_id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Header: Title, Company, Applied Date, Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {internship?.company || 'Company'}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {internship ? (
                        <Link
                          to={`/internships/${internship._id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {internship.title}
                        </Link>
                      ) : (
                        'Internship Position'
                      )}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Applied on {formattedDate}
                      </span>
                      {internship?.location && (
                        <span>• Location: {internship.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    {skillMatch && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {skillMatch.matchPercentage}% Skill Match
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isRejected
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : status === 'Selected'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Indicator */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Application Lifecycle Progress:
                  </p>

                  {isRejected ? (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 text-sm font-medium">
                      <XCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                      <span>
                        Application Not Selected. Keep honing your skills and apply to other open positions!
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Line connector */}
                      <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
                        {STAGES.map((stageName, idx) => {
                          const isPassed = currentStageIndex >= idx;
                          const isCurrent = currentStageIndex === idx;

                          return (
                            <div
                              key={stageName}
                              className={`flex sm:flex-col items-center sm:text-center p-2.5 sm:p-2 rounded-xl transition-all ${
                                isCurrent
                                  ? 'bg-indigo-50/80 border border-indigo-200 shadow-2xs'
                                  : isPassed
                                  ? 'bg-slate-50'
                                  : 'bg-white opacity-60'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mr-2 sm:mr-0 sm:mb-1.5 ${
                                  isPassed
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isPassed ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-xs font-semibold ${
                                  isCurrent
                                    ? 'text-indigo-700 font-bold'
                                    : isPassed
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {stageName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Link */}
                {internship && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/internships/${internship._id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                    >
                      View Internship Listing
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No applications yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Explore available internships, inspect your skill compatibility, and submit your first application.
          </p>
          <Link
            to="/internships"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            <span>Explore Internships</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
