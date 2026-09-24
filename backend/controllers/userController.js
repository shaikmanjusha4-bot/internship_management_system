const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, college, degree, graduationYear, skills, email, password } = req.body;

    if (name) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    if (degree !== undefined) user.degree = degree.trim();
    if (graduationYear !== undefined) {
      user.graduationYear = graduationYear ? Number(graduationYear) : null;
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another account',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (password && password.trim().length >= 6) {
      user.password = password;
    }

    if (skills !== undefined) {
      let parsedSkills = [];
      if (Array.isArray(skills)) {
        parsedSkills = skills
          .map((s) => (typeof s === 'string' ? s.trim() : ''))
          .filter((s) => s.length > 0);
      } else if (typeof skills === 'string') {
        parsedSkills = skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      // Deduplicate case-insensitively while preserving formatting
      const seen = new Set();
      const uniqueSkills = [];
      parsedSkills.forEach((s) => {
        const lower = s.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          uniqueSkills.push(s);
        }
      });
      user.skills = uniqueSkills;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        college: updatedUser.college,
        degree: updatedUser.degree,
        graduationYear: updatedUser.graduationYear,
        skills: updatedUser.skills,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
