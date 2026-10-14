const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "database", "app.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    users TEXT NOT NULL DEFAULT '[]'
  )
`);

module.exports = db;
