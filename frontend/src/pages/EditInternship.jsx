import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { internshipService } from '../services/api';
import Loading from '../components/Loading';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  Banknote,
  GraduationCap,
  Calendar,
  Plus,
  X,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

const COMMON_SKILLS = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'JavaScript',
  'Python',
  'SQL',
  'PostgreSQL',
  'TypeScript',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'Git',
  'REST APIs',
  'C++',
  'Java',
];

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    duration: '',
    stipend: '',
    eligibility: '',
    applicationDeadline: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setFetching(true);
        const res = await internshipService.getById(id);
        if (res.data && res.data.internship) {
          const item = res.data.internship;
          setFormData({
            title: item.title || '',
            company: item.company || '',
            description: item.description || '',
            location: item.location || '',
            duration: item.duration || '',
            stipend: item.stipend || '',
            eligibility: item.eligibility || '',
            applicationDeadline: item.applicationDeadline
              ? new Date(item.applicationDeadline).toISOString().split('T')[0]
              : '',
          });
          setSkills(item.requiredSkills || []);
        }
      } catch (err) {
        console.error('Error fetching internship for edit:', err);
        setError('Failed to fetch internship details.');
      } finally {
        setFetching(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;

    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.duration.trim() ||
      !formData.stipend.trim() ||
      !formData.applicationDeadline
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one required skill for skill matching.');
      return;
    }

    try {
      setLoading(true);
      await internshipService.update(id, {
        ...formData,
        requiredSkills: skills,
      });

      setSuccess('Internship updated successfully!');
      setTimeout(() => {
        navigate('/admin/internships');
      }, 1000);
    } catch (err) {
      console.error('Error updating internship:', err);
      setError(err.response?.data?.message || 'Failed to update internship.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading message="Loading internship data for editing..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          to="/admin/internships"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Manage Internships
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Edit Internship</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update responsibilities, required skills, duration, or deadlines for this listing.
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Internship Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Location, Duration, Stipend, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Duration *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Stipend *
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Application Deadline *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="date"
                  required
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Internship Description *
            </label>
            <textarea
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Eligibility Criteria
            </label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Required Skills for matching */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Required Skills * (Crucial for Match & Gap Engine)
                </label>
                <p className="text-xs text-slate-500">
                  The skill matcher compares student profiles against these exact skills.
                </p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                {skills.length} Skills Listed
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Type skill and press Add (e.g. MongoDB, Docker)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[44px]">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold shadow-2xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Click to add common skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.map((common) => {
                  if (skills.some((s) => s.toLowerCase() === common.toLowerCase())) return null;
                  return (
                    <button
                      key={common}
                      type="button"
                      onClick={() => handleAddSkill(common)}
                      className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-transparent rounded text-slate-600"
                    >
                      + {common}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <Link
              to="/admin/internships"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternship;
