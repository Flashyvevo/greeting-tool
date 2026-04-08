require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./db');
const usersRoute = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API routes
app.use('/api/users', usersRoute);

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

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
