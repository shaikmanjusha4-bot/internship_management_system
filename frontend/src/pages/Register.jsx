import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
  ArrowRight,
  Plus,
  X,
} from 'lucide-react';

const COMMON_SKILLS = [
  'React',
  'Node.js',
  'JavaScript',
  'Python',
  'SQL',
  'MongoDB',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Express',
  'Docker',
  'AWS',
  'Git',
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    degree: '',
    graduationYear: new Date().getFullYear() + 1,
  });

  const [skills, setSkills] = useState(['React', 'JavaScript']);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;

    // Check case-insensitive duplicate
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

    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one skill to help match internships.');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        skills,
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please verify your details and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Student Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the platform, showcase your technical skills, and unlock tailored internship recommendations.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* College, Degree, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                College / University
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. NIT Delhi"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Degree / Major
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech CS"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Graduation Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  min="2020"
                  max="2035"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Your Skills * (Used for skill matching & gap analysis)
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Type skill and press Add (e.g. Python, SQL, React)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs rounded-xl transition-colors inline-flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1.5 text-indigo-400 hover:text-indigo-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-1.5 font-medium">Quick suggestions to click & add:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.map((common) => (
                  <button
                    key={common}
                    type="button"
                    onClick={() => handleAddSkill(common)}
                    className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    + {common}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
