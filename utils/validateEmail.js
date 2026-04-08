/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

module.exports = validateEmail;
