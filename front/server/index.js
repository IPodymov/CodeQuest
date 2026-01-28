import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '..', 'db', 'codequest.db');

if (!fs.existsSync(dbPath)) {
  console.error(`Database file not found: ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const selectUserByIdentifier = db.prepare(`
  SELECT id, email, username, handle, password_hash, location, avatar_url AS avatar, status
  FROM users
  WHERE email = ? OR username = ?
`);
const selectUserRoles = db.prepare(`
  SELECT r.name
  FROM roles r
  JOIN user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = ?
`);
const selectConflicts = db.prepare(`
  SELECT id, email, username, handle
  FROM users
  WHERE email = ? OR username = ? OR handle = ?
`);
const insertUser = db.prepare(`
  INSERT INTO users (email, username, handle, password_hash, location, avatar_url, status)
  VALUES (?, ?, ?, ?, ?, ?, 'active')
`);
const insertUserRole = db.prepare(`
  INSERT OR IGNORE INTO user_roles (user_id, role_id)
  VALUES (?, (SELECT id FROM roles WHERE name = 'user'))
`);
const updateLastLogin = db.prepare(`
  UPDATE users SET last_login_at = datetime('now') WHERE id = ?
`);

function makeHandle(username) {
  const base = username.trim().toLowerCase().replace(/\s+/g, '_');
  return `@${base}`;
}

function normalize(input) {
  return typeof input === 'string' ? input.trim() : '';
}

function respondUser(userRow) {
  const roles = selectUserRoles.all(userRow.id).map((row) => row.name);
  return {
    id: userRow.id,
    email: userRow.email,
    username: userRow.username,
    handle: userRow.handle,
    location: userRow.location,
    avatar: userRow.avatar ?? null,
    roles
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/register', (req, res) => {
  const email = normalize(req.body.email);
  const username = normalize(req.body.username);
  const password = normalize(req.body.password);
  const location = typeof req.body.location === 'string' ? req.body.location : null;
  const avatar = typeof req.body.avatar === 'string' ? req.body.avatar : null;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username and password are required.' });
  }

  const handle = makeHandle(username);
  const conflict = selectConflicts.get(email, username, handle);
  if (conflict) {
    if (conflict.email?.toLowerCase() === email.toLowerCase()) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    if (conflict.username?.toLowerCase() === username.toLowerCase()) {
      return res.status(409).json({ message: 'Username already in use.' });
    }
    return res.status(409).json({ message: 'Handle already in use.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  insertUser.run(email, username, handle, passwordHash, location, avatar);

  let userRow = selectUserByIdentifier.get(email, email);
  if (!userRow) {
    return res.status(500).json({ message: 'User creation failed.' });
  }

  insertUserRole.run(userRow.id);
  userRow = selectUserByIdentifier.get(email, email);

  return res.status(201).json({ user: respondUser(userRow) });
});

app.post('/api/login', (req, res) => {
  const identifier = normalize(req.body.identifier);
  const password = normalize(req.body.password);

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  const userRow = selectUserByIdentifier.get(identifier, identifier);
  if (!userRow) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  if (userRow.status !== 'active') {
    return res.status(403).json({ message: 'Account is not active.' });
  }

  const isValid = bcrypt.compareSync(password, userRow.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  updateLastLogin.run(userRow.id);
  const updated = selectUserByIdentifier.get(userRow.email, userRow.email);
  return res.json({ user: respondUser(updated) });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
