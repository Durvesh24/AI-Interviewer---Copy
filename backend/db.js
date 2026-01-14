import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function getDb() {
  if (db) return db;

  db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      role TEXT,
      questions TEXT,
      answers TEXT,
      scores TEXT,
      date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Migration for existing databases
  try {
    await db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
  } catch (err) {
    // Ignore error if column already exists
  }


  return db;
}
