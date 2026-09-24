import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import Loading from '../components/Loading';
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Save,
  Sparkles,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'JavaScript',
  'Python',
  'SQL',
  'PostgreSQL',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'TypeScript',
  'Docker',
  'AWS',
  'Git',
  'Java',
  'C++',
];

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    graduationYear: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetching(true);
        const res = await userService.getProfile();
        if (res.data && res.data.user) {
          const u = res.data.user;
          setFormData({
            name: u.name || '',
            email: u.email || '',
            college: u.college || '',
            degree: u.degree || '',
            graduationYear: u.graduationYear || '',
          });
          setSkills(u.skills || []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setErrorMsg('Failed to fetch profile details');
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed) return;

    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Name is required');
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile({
        name: formData.name,
        email: formData.email,
        college: formData.college,
        degree: formData.degree,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
        skills,
      });

      await refreshUser();
      setSuccessMsg('Your profile and skills have been updated successfully! Recommendations have been refreshed.');
    } catch (err) {
      console.error('Update profile error:', err);
      setErrorMsg(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading message="Loading profile details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              {formData.name.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Student Profile & Skills</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Update your education and skill inventory to improve internship recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Education Background
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. Stanford / NIT"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Specialization</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2026"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Technical Skills ({skills.length})
                </h2>
                <p className="text-xs text-slate-500">
                  These skills are actively compared against internship requirements to calculate your match score.
                </p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
                Stored in MongoDB
              </span>
            </div>

            {/* Input to add skill */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Add a new skill (e.g. Docker, TypeScript, React)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Current Skills Badges */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px]">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-slate-400 hover:text-rose-600"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No skills added yet. Type a skill or pick below.</p>
              )}
            </div>

            {/* Suggested Skills */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5">Click to add commonly required skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map((skill) => {
                  const alreadyHas = skills.some((s) => s.toLowerCase() === skill.toLowerCase());
                  if (alreadyHas) return null;
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent text-slate-600 rounded-md transition-all"
                    >
                      + {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
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

export default Profile;
