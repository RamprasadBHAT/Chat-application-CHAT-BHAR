const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 4173;
const DB_PATH = path.join(__dirname, 'db', 'auth-db.json');

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw || '{"users":[]}');
}
function writeDb(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}
function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}
function monthKey(ts) {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
function canChangeUsername(user) {
  const now = Date.now();
  const current = monthKey(now);
  const count = (user.usernameChangeLogs || []).filter((x) => monthKey(x.ts) === current).length;
  return count < 3;
}
function checkGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(String(email || '').toLowerCase());
}

// NoSQL schema:
// user: { id, name, email, password, usernames:[{id,value,createdAt,updatedAt}], usernameChangeLogs:[{ts,from,to}], activeUsernameId }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/auth/users' && req.method === 'GET') {
    const db = readDb();
    const users = db.users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: 'user',
      username: (u.usernames || []).find((x) => x.id === u.activeUsernameId)?.value || '',
      usernames: u.usernames || []
    }));
    return json(res, 200, { users });
  }

  if (url.pathname === '/api/admin/reset-signups' && req.method === 'POST') {
    writeDb({ users: [] });
    return json(res, 200, { ok: true, message: 'All existing signups removed for fresh Gmail registration.' });
  }

  if (url.pathname === '/api/auth/signup' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    if (!name || !email || !password) return json(res, 400, { error: 'Please fill all signup fields.' });
    if (!checkGmail(email)) return json(res, 400, { error: 'Signup requires a valid @gmail.com address.' });
    if (password.length < 8) return json(res, 400, { error: 'Password must be at least 8 characters.' });

    const db = readDb();
    if (db.users.some((u) => u.email === email)) return json(res, 409, { error: 'Email already exists. Please login.' });

    const user = {
      id: randomUUID(),
      name,
      email,
      password,
      usernames: [],
      usernameChangeLogs: [],
      activeUsernameId: null,
      profilePic: '',
      bio: ''
    };
    db.users.push(user);
    writeDb(db);
    return json(res, 201, { user: { id: user.id, name, email, usernames: [], username: '', profilePic: '', bio: '' } });
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const db = readDb();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) return json(res, 401, { error: 'Invalid email/password.' });
    const username = (user.usernames || []).find((x) => x.id === user.activeUsernameId)?.value || '';
    return json(res, 200, { session: { id: user.id, name: user.name, email: user.email, role: 'user', username, profilePic: user.profilePic, bio: user.bio }, usernames: user.usernames || [] });
  }

  if (url.pathname === '/api/usernames/check' && req.method === 'POST') {
    const body = await parseBody(req);
    const username = String(body.username || '').trim().toLowerCase();
    if (!username) return json(res, 400, { error: 'Username is required.' });
    const db = readDb();
    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username));
    if (exists) return json(res, 409, { error: 'Username already taken' });
    return json(res, 200, { available: true });
  }

  if (url.pathname === '/api/usernames' && req.method === 'POST') {
    const body = await parseBody(req);
    const userId = String(body.userId || '');
    const username = String(body.username || '').trim();
    if (!userId || !username) return json(res, 400, { error: 'User and username are required.' });

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return json(res, 404, { error: 'User not found.' });
    if ((user.usernames || []).length >= 5) return json(res, 400, { error: 'Maximum 5 usernames allowed per Gmail account.' });

    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username.toLowerCase()));
    if (exists) return json(res, 409, { error: 'Username already taken' });

    const now = Date.now();
    const newName = { id: randomUUID(), value: username, createdAt: now, updatedAt: now };
    user.usernames.push(newName);
    user.activeUsernameId = newName.id;
    writeDb(db);

    return json(res, 201, { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: newName.value } });
  }

  if (url.pathname === '/api/auth/session/select-username' && req.method === 'POST') {
    const body = await parseBody(req);
    const userId = String(body.userId || '');
    const username = String(body.username || '').trim();
    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return json(res, 404, { error: 'User not found.' });
    const selected = (user.usernames || []).find((u) => u.value === username);
    if (!selected) return json(res, 404, { error: 'Username not found for account.' });
    user.activeUsernameId = selected.id;
    writeDb(db);
    return json(res, 200, { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: selected.value } });
  }

  if (url.pathname === '/api/auth/delete-account' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const db = readDb();
    const idx = db.users.findIndex(u => u.email === email && u.password === password);
    if (idx === -1) return json(res, 401, { error: 'Confirmation failed: Incorrect password.' });
    db.users.splice(idx, 1);
    writeDb(db);
    return json(res, 200, { ok: true });
  }

  if (url.pathname.startsWith('/api/usernames/') && req.method === 'PATCH') {
    const usernameId = url.pathname.split('/').pop();
    const body = await parseBody(req);
    const userId = String(body.userId || '');
    const username = String(body.username || '').trim();

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return json(res, 404, { error: 'User not found.' });
    if (!canChangeUsername(user)) return json(res, 429, { error: 'Username change limit reached: only 3 changes per month.' });

    const target = (user.usernames || []).find((u) => u.id === usernameId);
    if (!target) return json(res, 404, { error: 'Username not found.' });
    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username.toLowerCase() && x.id !== usernameId));
    if (exists) return json(res, 409, { error: 'Username already taken' });

    user.usernameChangeLogs = user.usernameChangeLogs || [];
    user.usernameChangeLogs.push({ ts: Date.now(), from: target.value, to: username });
    target.value = username;
    target.updatedAt = Date.now();
    writeDb(db);
    return json(res, 200, { ok: true, username: target });
  }

  const filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
  if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : ext === '.html' ? 'text/html' : 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`ChatBhar running on http://localhost:${PORT}`);
});
