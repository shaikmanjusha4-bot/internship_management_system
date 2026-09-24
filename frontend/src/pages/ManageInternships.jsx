import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipService } from '../services/api';
import Loading from '../components/Loading';
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await internshipService.getAll();
      setInternships(res.data?.internships || []);
    } catch (err) {
      console.error('Error fetching internships for admin:', err);
      setError('Failed to fetch internships.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove any related applications.`)) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await internshipService.delete(id);
      setSuccess(`"${title}" was deleted successfully.`);
      setInternships(internships.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting internship:', err);
      setError(err.response?.data?.message || 'Failed to delete internship.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredInternships = internships.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <Loading message="Loading all internships for management..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Internships
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, view, update, or remove internship listings in real-time.
          </p>
        </div>

        <Link
          to="/admin/internships/add"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Internship</span>
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by title, company, or location..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Internship Role & Company</th>
                <th className="py-3.5 px-4">Location & Duration</th>
                <th className="py-3.5 px-4">Stipend</th>
                <th className="py-3.5 px-4">Required Skills</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship) => {
                  const deadlineStr = internship.applicationDeadline
                    ? new Date(internship.applicationDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={internship._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{internship.title}</div>
                        <div className="text-indigo-600 font-medium text-xs">{internship.company}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{internship.location}</div>
                        <div className="text-slate-400">{internship.duration}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {internship.stipend}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {internship.requiredSkills?.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {deadlineStr}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          to={`/internships/${internship._id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 inline-block"
                          title="View Public Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/internships/edit/${internship._id}`}
                          className="p-1.5 text-indigo-600 hover:text-indigo-900 inline-block"
                          title="Edit Internship"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleDelete(internship._id, internship.title)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 inline-block disabled:opacity-50"
                          title="Delete Internship"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                    No internships match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageInternships;
