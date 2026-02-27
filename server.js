const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 4173;
const DB_PATH = path.join(__dirname, 'db', 'auth-db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDb() {
  let data;
  try {
    if (!fs.existsSync(DB_PATH)) {
      data = { users: [], posts: [], relationships: [] };
    } else {
      const raw = fs.readFileSync(DB_PATH, 'utf8').trim();
      data = JSON.parse(raw || '{"users":[],"posts":[],"relationships":[]}');
    }
  } catch (e) {
    console.error('Failed to read or parse database. Resetting to empty.', e);
    data = { users: [], posts: [], relationships: [] };
  }
  if (!data.users) data.users = [];
  if (!data.posts) data.posts = [];
  if (!data.relationships) data.relationships = [];
  if (!data.messages) data.messages = [];
  return data;
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);

  if (url.pathname === '/api/auth/users' && req.method === 'GET') {
    const db = readDb();
    const users = db.users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: 'user',
      username: (u.usernames || []).find((x) => x.id === u.activeUsernameId)?.value || '',
      usernames: u.usernames || [],
      profilePic: u.profilePic || '',
      bio: u.bio || '',
      profession: u.profession || '',
      location: u.location || '',
      socialLinks: u.socialLinks || { twitter: '', linkedin: '', github: '' },
      stats: u.stats || { posts: 0, followers: 0, following: 0 }
    }));
    return json(res, 200, { users });
  }

  if (url.pathname === '/api/relationships/following' && req.method === 'GET') {
    const userId = url.searchParams.get('userId');
    const db = readDb();
    const following = db.relationships.filter(r => r.followerId === userId);
    return json(res, 200, { following });
  }

  if (url.pathname === '/api/admin/reset-signups' && req.method === 'POST') {
    writeDb({ users: [], posts: [], relationships: [] });
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
      id: crypto.randomUUID(),
      name,
      email,
      password,
      usernames: [],
      usernameChangeLogs: [],
      activeUsernameId: null,
      profilePic: '',
      bio: '',
      profession: '',
      location: '',
      socialLinks: { twitter: '', linkedin: '', github: '' },
      stats: { posts: 0, followers: 0, following: 0 },
      isPrivate: false
    };
    db.users.push(user);
    writeDb(db);
    return json(res, 201, { user: { id: user.id, name, email, usernames: [], username: '', profilePic: '', bio: '', profession: '', location: '', socialLinks: user.socialLinks, stats: user.stats } });
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const db = readDb();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) return json(res, 401, { error: 'Invalid email/password.' });
    const username = (user.usernames || []).find((x) => x.id === user.activeUsernameId)?.value || '';
    return json(res, 200, {
      session: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'user',
        username,
        activeUsernameId: user.activeUsernameId,
        profilePic: user.profilePic,
        bio: user.bio,
        profession: user.profession || '',
        location: user.location || '',
        socialLinks: user.socialLinks || { twitter: '', linkedin: '', github: '' },
        stats: user.stats || { posts: 0, followers: 0, following: 0 }
      },
      usernames: user.usernames || []
    });
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
    const newName = { id: crypto.randomUUID(), value: username, createdAt: now, updatedAt: now };
    user.usernames.push(newName);
    user.activeUsernameId = newName.id;
    writeDb(db);

    return json(res, 201, { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: newName.value, activeUsernameId: user.activeUsernameId } });
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
    return json(res, 200, { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: selected.value, activeUsernameId: user.activeUsernameId } });
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

  if (url.pathname === '/api/messages' && req.method === 'GET') {
    const userId = req.headers['x-user-id'];
    const db = readDb();
    const messages = (db.messages || []).filter(m => m.participants.includes(userId));
    return json(res, 200, { messages });
  }

  if (url.pathname === '/api/messages' && req.method === 'POST') {
    const body = await parseBody(req);
    const { chatId, senderName, text, files, replyToId, viewOnce, ts, participants } = body;
    const senderId = req.headers['x-user-id'];
    const db = readDb();

    if (chatId.startsWith('dm:')) {
      const targetUserId = chatId.split(':').pop();
      // Allow if either user follows the other and it is accepted.
      const rel = db.relationships.find(r =>
        (r.followerId === senderId && r.followingId === targetUserId && r.status === 'accepted') ||
        (r.followerId === targetUserId && r.followingId === senderId && r.status === 'accepted')
      );
      if (!rel) return json(res, 403, { error: 'You must follow this user and they must accept to chat' });
    }

    const msg = { id: crypto.randomUUID(), chatId, senderId, senderName, text, files, replyToId, viewOnce, ts, participants };
    if (!db.messages) db.messages = [];
    db.messages.push(msg);
    writeDb(db);
    return json(res, 200, { message: msg });
  }

  if (url.pathname.startsWith('/api/messages/') && req.method === 'PATCH' && url.pathname.endsWith('/react')) {
    const parts = url.pathname.split('/');
    const messageId = parts[parts.length - 2];
    const body = await parseBody(req);
    const { emoji } = body;
    const userId = req.headers['x-user-id'];
    const db = readDb();
    const msg = (db.messages || []).find(m => m.id === messageId);
    if (!msg) return json(res, 404, { error: 'Message not found' });
    if (!msg.reactions) msg.reactions = [];
    const idx = msg.reactions.findIndex(r => r.userId === userId);
    if (idx !== -1) {
      msg.reactions[idx].emoji = emoji;
    } else {
      msg.reactions.push({ userId, emoji });
    }
    writeDb(db);
    return json(res, 200, { message: msg });
  }

  if (url.pathname.startsWith('/api/messages/') && req.method === 'DELETE') {
    const messageId = url.pathname.split('/').pop();
    const userId = req.headers['x-user-id'];
    const db = readDb();
    const idx = (db.messages || []).findIndex(m => m.id === messageId);
    if (idx === -1) return json(res, 404, { error: 'Message not found' });
    const msg = db.messages[idx];
    if (msg.senderId !== userId) return json(res, 403, { error: 'Forbidden' });
    db.messages.splice(idx, 1);
    writeDb(db);
    return json(res, 200, { ok: true });
  }

  // Social & Relationships
  if (url.pathname === '/api/relationships/follow' && req.method === 'POST') {
    const body = await parseBody(req);
    const { followerId, followingId } = body;
    const db = readDb();

    const follower = db.users.find(u => u.id === followerId);
    const following = db.users.find(u => u.id === followingId);

    if (!follower || !following) return json(res, 404, { error: 'User not found' });

    const existing = db.relationships.find(r => r.followerId === followerId && r.followingId === followingId);
    if (existing) return json(res, 400, { error: 'Relationship already exists' });

    const status = following.isPrivate ? 'pending' : 'accepted';
    const rel = { id: crypto.randomUUID(), followerId, followingId, status };
    db.relationships.push(rel);

    if (status === 'accepted') {
      follower.stats.following = (follower.stats.following || 0) + 1;
      following.stats.followers = (following.stats.followers || 0) + 1;
    }

    writeDb(db);
    return json(res, 200, { relationship: rel });
  }

  if (url.pathname === '/api/relationships/unfollow' && req.method === 'POST') {
    const body = await parseBody(req);
    const { followerId, followingId } = body;
    const db = readDb();

    const idx = db.relationships.findIndex(r => r.followerId === followerId && r.followingId === followingId);
    if (idx === -1) return json(res, 404, { error: 'Relationship not found' });

    const rel = db.relationships[idx];
    if (rel.status === 'accepted') {
      const follower = db.users.find(u => u.id === followerId);
      const following = db.users.find(u => u.id === followingId);
      if (follower) follower.stats.following = Math.max(0, (follower.stats.following || 0) - 1);
      if (following) following.stats.followers = Math.max(0, (following.stats.followers || 0) - 1);
    }

    db.relationships.splice(idx, 1);
    writeDb(db);
    return json(res, 200, { message: 'Unfollowed' });
  }

  if (url.pathname === '/api/relationships/accept' && req.method === 'POST') {
    const body = await parseBody(req);
    const { relationshipId } = body;
    const db = readDb();

    const rel = db.relationships.find(r => r.id === relationshipId);
    if (!rel) return json(res, 404, { error: 'Relationship not found' });

    if (rel.status === 'accepted') return json(res, 400, { error: 'Already accepted' });

    rel.status = 'accepted';
    const follower = db.users.find(u => u.id === rel.followerId);
    const following = db.users.find(u => u.id === rel.followingId);

    if (follower && following) {
      follower.stats.following = (follower.stats.following || 0) + 1;
      following.stats.followers = (following.stats.followers || 0) + 1;
    }

    writeDb(db);
    return json(res, 200, { relationship: rel });
  }

  if (url.pathname === '/api/relationships/requests' && req.method === 'GET') {
    const userId = url.searchParams.get('userId');
    if (!userId) return json(res, 400, { error: 'userId is required' });

    const db = readDb();
    const requests = db.relationships.filter(r => r.followingId === userId && r.status === 'pending');

    const enriched = requests.map(r => {
      const follower = db.users.find(u => u.id === r.followerId);
      return {
        ...r,
        followerName: follower ? (follower.name || (follower.usernames || []).find(x => x.id === follower.activeUsernameId)?.value) : 'Unknown',
        followerHandle: follower ? (follower.usernames || []).find(x => x.id === follower.activeUsernameId)?.value : ''
      };
    });

    return json(res, 200, { requests: enriched });
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

  if (url.pathname === '/api/upload-media' && req.method === 'POST') {
    const userId = req.headers['x-user-id'];
    if (!userId) return json(res, 401, { error: 'Unauthorized: User ID required' });

    const db = readDb();
    if (!db.users.some(u => u.id === userId)) return json(res, 403, { error: 'Forbidden: Invalid User' });

    const filename = req.headers['x-filename'] || 'upload.bin';
    const ext = path.extname(filename);
    const safeName = `${crypto.randomUUID()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeName);
    const fileStream = fs.createWriteStream(targetPath);

    req.pipe(fileStream);

    return new Promise((resolve) => {
      fileStream.on('finish', () => {
        json(res, 201, { url: `/uploads/${safeName}`, name: filename, type: req.headers['content-type'] });
        resolve();
      });
      fileStream.on('error', (err) => {
        console.error('File stream error', err);
        json(res, 500, { error: 'Failed to write file' });
        resolve();
      });
      req.on('error', (err) => {
        console.error('Upload error', err);
        json(res, 500, { error: 'Upload failed' });
        resolve();
      });
    });
  }

  if (url.pathname === '/api/auth/profile' && req.method === 'PATCH') {
    const body = await parseBody(req);
    const { userId, name, bio, profession, location, socialLinks, profilePic, isPrivate } = body;
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return json(res, 404, { error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profession !== undefined) user.profession = profession;
    if (location !== undefined) user.location = location;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    writeDb(db);
    return json(res, 200, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: (user.usernames || []).find((x) => x.id === user.activeUsernameId)?.value || '',
        activeUsernameId: user.activeUsernameId,
        profilePic: user.profilePic,
        bio: user.bio,
        profession: user.profession,
        location: user.location,
        socialLinks: user.socialLinks,
        stats: user.stats,
        isPrivate: user.isPrivate
      }
    });
  }

  if (url.pathname === '/api/posts' && req.method === 'GET') {
    const db = readDb();
    return json(res, 200, { posts: db.posts || [] });
  }

  if (url.pathname === '/api/posts' && req.method === 'POST') {
    const body = await parseBody(req);
    const db = readDb();
    const newPost = {
      id: crypto.randomUUID(),
      userId: body.userId,
      userName: body.userName,
      type: body.type || 'short',
      caption: body.caption || '',
      description: body.description || '',
      files: body.files || [],
      edits: body.edits || [],
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt || null,
      interactions: body.interactions || { likes: 0, likedBy: [], comments: [], shares: 0 }
    };
    db.posts.push(newPost);
    const user = db.users.find(u => u.id === body.userId);
    if (user) {
      user.stats = user.stats || { posts: 0, followers: 0, following: 0 };
      user.stats.posts = (user.stats.posts || 0) + 1;
    }
    writeDb(db);
    return json(res, 201, { post: newPost });
  }

  if (url.pathname.startsWith('/api/posts/') && req.method === 'PATCH') {
    const postId = url.pathname.split('/').pop();
    const body = await parseBody(req);
    const db = readDb();
    const idx = db.posts.findIndex(p => p.id === postId);
    if (idx === -1) return json(res, 404, { error: 'Post not found' });
    db.posts[idx] = { ...db.posts[idx], ...body };
    writeDb(db);
    return json(res, 200, { post: db.posts[idx] });
  }

  if (url.pathname.startsWith('/api/posts/') && req.method === 'DELETE') {
    const postId = url.pathname.split('/').pop();
    const db = readDb();
    const idx = db.posts.findIndex(p => p.id === postId);
    if (idx === -1) return json(res, 404, { error: 'Post not found' });
    const post = db.posts[idx];
    const user = db.users.find(u => u.id === post.userId);
    if (user && user.stats) {
      user.stats.posts = Math.max(0, (user.stats.posts || 0) - 1);
    }
    db.posts.splice(idx, 1);
    writeDb(db);
    return json(res, 200, { ok: true });
  }

  const filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
  if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const type = ext === '.css' ? 'text/css' :
               ext === '.js' ? 'application/javascript' :
               ext === '.html' ? 'text/html' :
               ext === '.png' ? 'image/png' :
               ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
               ext === '.gif' ? 'image/gif' :
               ext === '.mp4' ? 'video/mp4' :
               'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`ChatBhar running on http://localhost:${PORT}`);
});
