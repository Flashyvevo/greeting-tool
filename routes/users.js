const express = require('express');
const router = express.Router();
const db = require('../db');
const validateEmail = require('../utils/validateEmail');

// GET /api/users - return all users as JSON
router.get('/', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// POST /api/users - create a new user
router.post('/', (req, res) => {
  const { name, email } = req.body;

  // Input validation
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required.');
  }
  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!validateEmail(email)) {
    errors.push('Email is not valid.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Attempt insert with error handling
  try {
    const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name.trim(), email.trim());
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(user);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ errors: ['A user with that email already exists.'] });
    }
    res.status(500).json({ errors: ['Failed to create user.'] });
  }
});

module.exports = router;
