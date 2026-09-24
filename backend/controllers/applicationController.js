const Application = require('../models/Application');
const Internship = require('../models/Internship');
const User = require('../models/User');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// Allowed application statuses
const VALID_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
];

// @desc    Apply for an internship
// @route   POST /api/applications
// @access  Private (Student)
const applyForInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;

    if (!internshipId) {
      return res.status(400).json({
        success: false,
        message: 'Internship ID is required',
      });
    }

    // Check internship existence
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      student: req.user._id,
      internship: internshipId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship',
      });
    }

    const application = await Application.create({
      student: req.user._id,
      internship: internshipId,
      status: 'Applied',
      appliedAt: new Date(),
    });

    await application.populate('internship');

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Apply For Internship Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting application',
    });
  }
};

// @desc    Get current student's submitted applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('internship')
      .sort({ appliedAt: -1 });

    const formatted = applications.map((app) => {
      const obj = app.toObject();
      if (obj.internship) {
        obj.skillMatch = calculateSkillMatch(
          req.user.skills || [],
          obj.internship.requiredSkills || []
        );
      }
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      applications: formatted,
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving applications',
    });
  }
};

// @desc    Get all applications (with optional status & internship filters)
// @route   GET /api/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const { status, internshipId } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (internshipId) {
      filter.internship = internshipId;
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email college degree graduationYear skills')
      .populate('internship', 'title company location duration stipend requiredSkills')
      .sort({ appliedAt: -1 });

    // Compute skill match for each applicant to display in admin dashboard
    const enriched = applications.map((app) => {
      const obj = app.toObject();
      if (obj.student && obj.internship) {
        obj.skillMatch = calculateSkillMatch(
          obj.student.skills || [],
          obj.internship.requiredSkills || []
        );
      }
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: enriched.length,
      applications: enriched,
    });
  } catch (error) {
    console.error('Get All Applications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving applications',
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('student', 'name email college degree graduationYear skills')
      .populate('internship', 'title company location duration stipend requiredSkills');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application status updated to "${status}"`,
      application,
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating status',
    });
  }
};

// @desc    Get dashboard statistics for admin
// @route   GET /api/applications/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalInternships, totalApplications, selectedCount, recentApps] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        Internship.countDocuments({}),
        Application.countDocuments({}),
        Application.countDocuments({ status: 'Selected' }),
        Application.find({})
          .populate('student', 'name email college skills')
          .populate('internship', 'title company requiredSkills')
          .sort({ appliedAt: -1 })
          .limit(5),
      ]);

    const enrichedRecentApps = recentApps.map((app) => {
      const obj = app.toObject();
      if (obj.student && obj.internship) {
        obj.skillMatch = calculateSkillMatch(
          obj.student.skills || [],
          obj.internship.requiredSkills || []
        );
      }
      return obj;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalInternships,
        totalApplications,
        selectedStudents: selectedCount,
      },
      recentApplications: enrichedRecentApps,
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics',
    });
  }
};

module.exports = {
  applyForInternship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getAdminStats,
};
