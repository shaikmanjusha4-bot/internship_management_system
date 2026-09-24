import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { internshipService } from '../services/api';
import InternshipCard from '../components/InternshipCard';
import Loading from '../components/Loading';
import { Search, Filter, MapPin, Code, RotateCcw, Briefcase } from 'lucide-react';

const COMMON_SKILL_FILTERS = ['All', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'JavaScript'];
const COMMON_LOCATIONS = ['All', 'Remote', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune'];

const Internships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedSkill && selectedSkill !== 'All') params.skill = selectedSkill;
      if (selectedLocation && selectedLocation !== 'All') params.location = selectedLocation;

      const res = await internshipService.getAll(params);
      setInternships(res.data?.internships || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Failed to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [selectedSkill, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSkill('All');
    setSelectedLocation('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Internships</h1>
        <p className="mt-1 text-sm text-slate-500">
          Find and apply to real-world software, data, and design internships matching your skills.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        {/* Search Input Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, role, company, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            Search
          </button>
          {(searchTerm || selectedSkill !== 'All' || selectedLocation !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors inline-flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Dropdowns / Filter Badges Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          {/* Skill Filter Buttons */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center">
              <Code className="w-3.5 h-3.5 mr-1" /> Skill:
            </span>
            {COMMON_SKILL_FILTERS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(skill)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSkill === skill
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Location Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" /> Location:
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Internships Grid */}
      {loading ? (
        <Loading message="Fetching opportunities..." />
      ) : internships.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Showing {internships.length} Available {internships.length === 1 ? 'Internship' : 'Internships'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No internships found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing skill filters, or exploring all locations.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Internships;
