const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(process.env.DB_PATH || path.join(__dirname, "..", "database", "app.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    users TEXT NOT NULL DEFAULT '[]'
  )
`);

module.exports = db;
