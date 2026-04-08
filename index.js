require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./db');
const usersRoute = require('./routes/users');
const analyticsRoute = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API routes
app.use('/api/users', usersRoute);
app.use('/api/analytics', analyticsRoute);

// Analytics page
app.get('/analytics', (req, res) => {
  const analytics = require('./models/analytics');
  res.render('analytics', {
    totalUsers: analytics.getTotalUsers(),
    newUsersToday: analytics.getNewUsersToday(),
    signupsByDay: analytics.getSignupsByDay(),
    recentUsers: analytics.getRecentUsers(),
  });
});

// Users page
app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  res.render('users', { users, message: null, messageType: null });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const validateEmail = require('./utils/validateEmail');
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();

  if (!name || !name.trim() || !email || !validateEmail(email)) {
    return res.render('users', { users, message: 'Please provide a valid name and email.', messageType: 'error' });
  }

  try {
    db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name.trim(), email.trim());
    const updated = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    res.render('users', { users: updated, message: `${name.trim()} added successfully.`, messageType: 'success' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.render('users', { users, message: 'A user with that email already exists.', messageType: 'error' });
    }
    res.render('users', { users, message: 'Failed to add user.', messageType: 'error' });
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  const greeting = process.env.GREETING || 'Hello';
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

  res.render('dashboard', {
    greeting,
    userCount,
    nodeVersion: process.version,
    currentTime: new Date().toLocaleString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
