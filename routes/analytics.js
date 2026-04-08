const express = require('express');
const router = express.Router();
const analytics = require('../models/analytics');

// GET /api/analytics - return analytics data as JSON
router.get('/', (req, res) => {
  res.json({
    totalUsers: analytics.getTotalUsers(),
    newUsersToday: analytics.getNewUsersToday(),
    signupsByDay: analytics.getSignupsByDay(),
    recentUsers: analytics.getRecentUsers(),
  });
});

module.exports = router;
