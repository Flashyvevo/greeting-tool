const db = require('../db');

/**
 * Finds a user by their email address.
 * @param {string} email
 * @returns {object|undefined} The full user record, or undefined if not found.
 */
function findByEmail(email) {
  return db.prepare('SELECT id, email, name, created_at FROM users WHERE email = ?').get(email);
}

module.exports = { findByEmail };
