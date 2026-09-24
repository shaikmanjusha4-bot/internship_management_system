const Internship = require('../models/Internship');
const Application = require('../models/Application');
const { calculateSkillMatch } = require('../utils/skillMatcher');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to optionally extract student user from request header if present
const getOptionalUser = async (req) => {
  if (req.user) return req.user;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ims_development_secret_key_2026_xyz'
      );
      return await User.findById(decoded.id).select('-password');
    } catch {
      return null;
    }
  }
  return null;
};

// @desc    Get all internships (with search, location, and skill filters)
// @route   GET /api/internships
// @access  Public / Optional Auth
const getInternships = async (req, res) => {
  try {
    const { search, skill, location } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { company: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (location && location.trim() !== 'All' && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (skill && skill.trim() !== 'All' && skill.trim() !== '') {
      query.requiredSkills = { $elemMatch: { $regex: skill.trim(), $options: 'i' } };
    }

    const internships = await Internship.find(query).sort({ createdAt: -1 });

    const currentUser = await getOptionalUser(req);
    const studentSkills = currentUser && currentUser.role === 'student' ? currentUser.skills : null;

    let appliedInternshipIds = new Set();
    if (currentUser && currentUser.role === 'student') {
      const studentApps = await Application.find({ student: currentUser._id }).select('internship');
      appliedInternshipIds = new Set(studentApps.map((a) => a.internship.toString()));
    }

    const formatted = internships.map((internship) => {
      const base = internship.toObject();
      if (studentSkills) {
        base.skillMatch = calculateSkillMatch(studentSkills, internship.requiredSkills);
        base.hasApplied = appliedInternshipIds.has(internship._id.toString());
      }
      return base;
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      internships: formatted,
    });
  } catch (error) {
    console.error('Get Internships Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving internships',
    });
  }
};

// @desc    Get recommended internships based on student skills
// @route   GET /api/internships/recommended
// @access  Private (Student)
const getRecommendedInternships = async (req, res) => {
  try {
    const student = req.user;
    if (!student || student.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access recommended internships',
      });
    }

    const internships = await Internship.find({}).sort({ createdAt: -1 });

    // Fetch student's existing applications
    const studentApps = await Application.find({ student: student._id }).select('internship status');
    const appMap = new Map();
    studentApps.forEach((a) => {
      appMap.set(a.internship.toString(), a.status);
    });

    // Compute skill match for each internship
    const recommendations = internships.map((internship) => {
      const base = internship.toObject();
      const matchDetails = calculateSkillMatch(student.skills || [], internship.requiredSkills || []);
      return {
        ...base,
        skillMatch: matchDetails,
        hasApplied: appMap.has(internship._id.toString()),
        applicationStatus: appMap.get(internship._id.toString()) || null,
      };
    });

    // Sort by match percentage descending; ties broken by date
    recommendations.sort((a, b) => {
      if (b.skillMatch.matchPercentage !== a.skillMatch.matchPercentage) {
        return b.skillMatch.matchPercentage - a.skillMatch.matchPercentage;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error('Get Recommended Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating recommendations',
    });
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public / Optional Auth
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    const base = internship.toObject();
    const currentUser = await getOptionalUser(req);

    if (currentUser && currentUser.role === 'student') {
      base.skillMatch = calculateSkillMatch(currentUser.skills || [], internship.requiredSkills || []);
      const existingApp = await Application.findOne({
        student: currentUser._id,
        internship: internship._id,
      });
      base.hasApplied = !!existingApp;
      base.applicationStatus = existingApp ? existingApp.status : null;
      base.appliedAt = existingApp ? existingApp.appliedAt : null;
    }

    return res.status(200).json({
      success: true,
      internship: base,
    });
  } catch (error) {
    console.error('Get Internship By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Internship not found (invalid ID format)',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving internship details',
    });
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Admin)
const createInternship = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      duration,
      stipend,
      requiredSkills,
      eligibility,
      applicationDeadline,
    } = req.body;

    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !duration ||
      !stipend ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Process requiredSkills
    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter((s) => s.length > 0);
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    if (skillsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill',
      });
    }

    // Unique skills preserving order
    const seen = new Set();
    const uniqueSkills = [];
    skillsArray.forEach((s) => {
      const lower = s.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueSkills.push(s);
      }
    });

    const internship = await Internship.create({
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      location: location.trim(),
      duration: duration.trim(),
      stipend: stipend.trim(),
      requiredSkills: uniqueSkills,
      eligibility: eligibility ? eligibility.trim() : 'Open to all students and recent graduates',
      applicationDeadline: new Date(applicationDeadline),
    });

    return res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      internship,
    });
  } catch (error) {
    console.error('Create Internship Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating internship',
    });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Admin)
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    const {
      title,
      company,
      description,
      location,
      duration,
      stipend,
      requiredSkills,
      eligibility,
      applicationDeadline,
    } = req.body;

    if (title !== undefined) internship.title = title.trim();
    if (company !== undefined) internship.company = company.trim();
    if (description !== undefined) internship.description = description.trim();
    if (location !== undefined) internship.location = location.trim();
    if (duration !== undefined) internship.duration = duration.trim();
    if (stipend !== undefined) internship.stipend = stipend.trim();
    if (eligibility !== undefined) internship.eligibility = eligibility.trim();
    if (applicationDeadline !== undefined) {
      internship.applicationDeadline = new Date(applicationDeadline);
    }

    if (requiredSkills !== undefined) {
      let skillsArray = [];
      if (Array.isArray(requiredSkills)) {
        skillsArray = requiredSkills
          .map((s) => (typeof s === 'string' ? s.trim() : ''))
          .filter((s) => s.length > 0);
      } else if (typeof requiredSkills === 'string') {
        skillsArray = requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      if (skillsArray.length > 0) {
        const seen = new Set();
        const uniqueSkills = [];
        skillsArray.forEach((s) => {
          const lower = s.toLowerCase();
          if (!seen.has(lower)) {
            seen.add(lower);
            uniqueSkills.push(s);
          }
        });
        internship.requiredSkills = uniqueSkills;
      }
    }

    const updatedInternship = await internship.save();

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      internship: updatedInternship,
    });
  } catch (error) {
    console.error('Update Internship Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating internship',
    });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin)
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    await Internship.findByIdAndDelete(req.params.id);
    // Also remove associated applications to maintain referential integrity
    await Application.deleteMany({ internship: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Internship and associated applications deleted successfully',
    });
  } catch (error) {
    console.error('Delete Internship Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting internship',
    });
  }
};

module.exports = {
  getInternships,
  getRecommendedInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
