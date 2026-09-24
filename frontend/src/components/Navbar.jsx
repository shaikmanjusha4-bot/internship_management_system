import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Users,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-indigo-600 font-semibold'
        : 'text-slate-600 hover:text-indigo-600'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                  Intern<span className="text-indigo-600">Track</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block">
                  Internship Management
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={linkClass('/')}>
              Home
            </Link>
            <Link to="/internships" className={linkClass('/internships')}>
              Explore Internships
            </Link>

            {/* Student specific links */}
            {isAuthenticated && isStudent && (
              <>
                <Link to="/student/dashboard" className={linkClass('/student/dashboard')}>
                  Dashboard
                </Link>
                <Link
                  to="/recommended"
                  className={`inline-flex items-center ${linkClass('/recommended')}`}
                >
                  <Sparkles className="w-4 h-4 mr-1 text-indigo-500" />
                  Recommended
                </Link>
                <Link to="/my-applications" className={linkClass('/my-applications')}>
                  My Applications
                </Link>
                <Link to="/profile" className={linkClass('/profile')}>
                  Profile
                </Link>
              </>
            )}

            {/* Admin specific links */}
            {isAuthenticated && isAdmin && (
              <>
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/admin/internships" className={linkClass('/admin/internships')}>
                  Manage Internships
                </Link>
                <Link to="/admin/applications" className={linkClass('/admin/applications')}>
                  Applications
                </Link>
              </>
            )}
          </div>

          {/* Right Action / Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-slate-800">
                    {user?.name}
                  </span>
                  <span className="block text-[11px] text-slate-500 capitalize font-medium">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore Internships
          </Link>

          {isAuthenticated && isStudent && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/recommended"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 font-semibold"
              >
                Recommended Internships
              </Link>
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Profile & Skills
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/internships"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Manage Internships
              </Link>
              <Link
                to="/admin/internships/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Add New Internship
              </Link>
              <Link
                to="/admin/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Manage Applications
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
