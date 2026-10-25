/**
 * Tiny JSON-file database.
 *
 * Everything lives in one in-memory object (`db`) that is written to disk
 * by `save()` after each change. Services read/modify `db` directly.
 *
 * To move to SQLite/PostgreSQL later, this file plus the services are the
 * only places that need to change - controllers and routes stay as they are.
 */
const fs = require('fs');
const path = require('path');
const { dbFile } = require('../config/env');

const fresh = () => ({
  users: [],
  groups: [],
  expenses: [],
  settlements: [],
  messages: [],
  personalExpenses: [],
});

function load() {
  const data = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, 'utf8')) : fresh();
  // Make sure every collection exists (older files may be missing some).
  for (const key of Object.keys(fresh())) {
    if (!data[key]) data[key] = [];
  }
  return data;
}

const db = load();

// Write to a temp file first, then rename, so a crash can't corrupt the data.
function save() {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  const tmp = dbFile + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, dbFile);
}

module.exports = { db, save };
