const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'app.db'));

// Create users table and seed sample data
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  insert.run('Alice Johnson', 'alice@example.com');
  insert.run('Bob Smith', 'bob@example.com');
  insert.run('Charlie Brown', 'charlie@example.com');
}

module.exports = db;
