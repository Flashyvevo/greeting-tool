# Greeting Tool

A Node.js web app built with Express, SQLite, and EJS for managing users and viewing analytics.

## Getting Started

```bash
npm install
npm start
```

Visit http://localhost:3000 to view the dashboard.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create a new user |
| GET | /api/analytics | View analytics data |
| GET | /api/health | Health check |

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: SQLite (better-sqlite3)
- **Templates**: EJS
