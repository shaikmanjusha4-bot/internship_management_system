import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-lg">InternTrack</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm">
              An intelligent, skill-driven Internship Management System with automated skill gap analysis
              and internship recommendation engine. Built for full-stack engineering excellence.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">React + Vite</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">Node.js + Express</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">MongoDB Atlas</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-indigo-600 transition-colors">Explore Internships</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition-colors">Student & Admin Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 transition-colors">Student Registration</Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Key Features</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Skill-Based Recommendation</li>
              <li>Automated Skill Gap Analysis</li>
              <li>Application Tracking Pipeline</li>
              <li>Admin Internship Management</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Internship Management System. Built for FSD Training Project.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for Career Growth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
