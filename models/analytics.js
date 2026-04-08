const db = require('../db');

/**
 * Returns the total number of users.
 */
function getTotalUsers() {
  return db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
}

/**
 * Returns the number of users who signed up today.
 */
function getNewUsersToday() {
  return db.prepare("SELECT COUNT(*) AS count FROM users WHERE date(created_at) = date('now')").get().count;
}

/**
 * Returns user signups grouped by date (last 7 days).
 */
function getSignupsByDay() {
  return db.prepare(`
    SELECT date(created_at) AS date, COUNT(*) AS count
    FROM users
    WHERE created_at >= datetime('now', '-7 days')
    GROUP BY date(created_at)
    ORDER BY date DESC
  `).all();
}

/**
 * Returns the most recently created users.
 * @param {number} limit
 */
function getRecentUsers(limit = 5) {
  return db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT ?').all(limit);
}

module.exports = { getTotalUsers, getNewUsersToday, getSignupsByDay, getRecentUsers };
