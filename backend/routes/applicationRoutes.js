const express = require('express');
const router = express.Router();
const {
  applyForInternship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getAdminStats,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Student routes
router.post('/', protect, authorize('student'), applyForInternship);
router.get('/my', protect, authorize('student'), getMyApplications);

// Admin routes
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/', protect, authorize('admin'), getAllApplications);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
