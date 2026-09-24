import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email, password });

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const destination = location.state?.from?.pathname || '/student/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your dashboard and internships
          </p>
        </div>

        {/* Quick Demo Credentials helper */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-700 mb-2">⚡ Quick Test Credentials (Pre-seeded):</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student@ims.com', 'student123')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded text-indigo-600 font-medium text-center transition-colors"
            >
              Fill Student
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@ims.com', 'admin123')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-center transition-colors"
            >
              Fill Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
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
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Register as a student
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
