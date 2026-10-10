import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { seedDatabase } from './seed';

// Ensure data folder exists. Vercel's filesystem is read-only except /tmp,
// so the DB lives there (re-seeded on each cold start).
const dbDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'farmart.db');

// Global singleton instance for Next.js hot-reloading
const globalForDb = global as unknown as {
  dbInstance?: Database.Database;
};

function initDb(): Database.Database {
  if (globalForDb.dbInstance) {
    return globalForDb.dbInstance;
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  seedDatabase(db);

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.dbInstance = db;
  }

  return db;
}

export const getDb = initDb;
export default getDb;
