const express = require('express');
const router = express.Router();
const {
  getInternships,
  getRecommendedInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public or optional auth routes
router.get('/', getInternships);

// Recommendation route (student only, must be before :id)
router.get('/recommended', protect, authorize('student'), getRecommendedInternships);

// Single internship route
router.get('/:id', getInternshipById);

// Admin-only routes
router.post('/', protect, authorize('admin'), createInternship);
router.put('/:id', protect, authorize('admin'), updateInternship);
router.delete('/:id', protect, authorize('admin'), deleteInternship);

module.exports = router;
