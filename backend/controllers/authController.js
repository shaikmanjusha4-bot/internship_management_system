const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'ims_development_secret_key_2026_xyz',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      college,
      degree,
      graduationYear,
      skills,
    } = req.body;

    // Field validations
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Format skills array
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

    // Always register as 'student' from public endpoint
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student',
      college: college ? college.trim() : '',
      degree: degree ? degree.trim() : '',
      graduationYear: graduationYear ? Number(graduationYear) : null,
      skills: [...new Set(parsedSkills)],
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Student registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

module.exports = {
  register,
  login,
};
