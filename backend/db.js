import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let db;

// Wrapper for PostgreSQL to mimic SQLite API
class PostgresWrapper {
  constructor(pool) {
    this.pool = pool;
  }

  // Convert SQLite "?" placeholders to Postgres "$1, $2, ..."
  _convertSql(sql) {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  }

  async get(sql, params = []) {
    const res = await this.pool.query(this._convertSql(sql), params);
    return res.rows[0];
  }

  async all(sql, params = []) {
    const res = await this.pool.query(this._convertSql(sql), params);
    return res.rows;
  }

  async run(sql, params = []) {
    const res = await this.pool.query(this._convertSql(sql), params);
    // SQLite returns { lastID, changes }. Postgres returns { rowCount }.
    // We don't have strictly equivalent lastID without "RETURNING id" in INSERTs,
    // but the app doesn't seem to rely on lastID for Critical paths (users uses select, interviews uses manual ID).
    return { changes: res.rowCount };
  }

  async exec(sql) {
    return await this.pool.query(sql);
  }
}

export async function getDb() {
  if (db) return db;

  if (process.env.DATABASE_URL) {
    // --- POSTGRESQL ("PROD" / RENDER) ---
    console.log("Connecting to PostgreSQL...");
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render/some cloud DBs
      }
    });

    // Test connection
    try {
      await pool.query('SELECT 1');
    } catch (err) {
      console.error("PostgreSQL Connection Failed:", err);
      throw err;
    }

    db = new PostgresWrapper(pool);

    // Initialize Schema for Postgres
    // Note: TEXT UNIQUE -> VARCHAR, or just TEXT is fine in PG.
    // AUTOINCREMENT -> SERIAL in PG (but we use explicit CREATE TABLE syntax).
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
      );
    `);

    await db.exec(`
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

    console.log("PostgreSQL Database initialized");

  } else {
    // --- SQLITE (LOCAL DEV) ---
    console.log("Using SQLite (local)...");
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

    // Migration for existing SQLite databases
    try {
      await db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Ignore error if column already exists
    }

    try {
      await db.run("ALTER TABLE users ADD COLUMN last_login TEXT");
    } catch (err) {
      // Ignore
    }
  }

  return db;
}
