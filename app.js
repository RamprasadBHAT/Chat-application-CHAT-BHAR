const AUTH_USERS_KEY = 'chatbhar.users';
const AUTH_SESSION_KEY = 'chatbhar.session';
const CHAT_STORE_KEY = 'chatbhar.chatStore';
const UPLOAD_STORE_KEY = 'chatbhar.uploads';

const authGate = document.getElementById('authGate');
const appShell = document.getElementById('appShell');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');

const screens = [...document.querySelectorAll('.screen')];
const navButtons = [...document.querySelectorAll('.nav-btn')];

const storiesRow = document.getElementById('storiesRow');
const feedList = document.getElementById('feedList');

const uploadTypeRow = document.getElementById('uploadTypeRow');
const uploadForm = document.getElementById('uploadForm');
const uploadCaption = document.getElementById('uploadCaption');
const uploadDescription = document.getElementById('uploadDescription');
const uploadFiles = document.getElementById('uploadFiles');
const uploadHint = document.getElementById('uploadHint');
const uploadStatus = document.getElementById('uploadStatus');
const uploadList = document.getElementById('uploadList');

const activeChatTitle = document.getElementById('activeChatTitle');
const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const attachmentPreview = document.getElementById('attachmentPreview');
const backupNowBtn = document.getElementById('backupNowBtn');
const shareBackupBtn = document.getElementById('shareBackupBtn');
const importBackupBtn = document.getElementById('importBackupBtn');
const backupInput = document.getElementById('backupInput');
const chatUsersWrap = document.getElementById('chatUsersWrap');
const newChatBtn = document.getElementById('newChatBtn');
const deleteChatBtn = document.getElementById('deleteChatBtn');
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatMenu = document.getElementById('chatMenu');

const storyViewer = document.getElementById('storyViewer');
const storyViewerUser = document.getElementById('storyViewerUser');
const storyViewerMedia = document.getElementById('storyViewerMedia');
const closeStoryViewer = document.getElementById('closeStoryViewer');
const prevStory = document.getElementById('prevStory');
const nextStory = document.getElementById('nextStory');

const typeRules = {
  short: { accept: 'video/*', multiple: false, hint: 'Shorts: choose 1 short-form video.' },
  carousel: { accept: 'image/*', multiple: true, hint: 'Carousel: choose multiple images.' },
  ltv: { accept: 'video/*', multiple: false, hint: 'LTV: choose 1 long-form video.' },
  story: { accept: 'image/*,video/*', multiple: false, hint: 'Story: choose 1 image/video (expires in 24h).' }
};

let selectedUploadType = 'short';
let pendingFiles = [];
let chatStore = sanitizeChatStore(loadJson(CHAT_STORE_KEY, { General: [] }));
let activeChat = Object.keys(chatStore)[0] || 'General';
let uploads = sanitizeUploads(loadJson(UPLOAD_STORE_KEY, []));
let activeSession = null;
let activeStoryItems = [];
let activeStoryIndex = 0;

if (!chatStore[activeChat]) chatStore[activeChat] = [];

bootstrapUsers();
loadSession();
bindEvents();
applyUploadType();
renderChatUsers();
renderMessages();
renderUploads();
renderHome();

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try { return JSON.parse(raw); } catch { return structuredClone(fallback); }
}

function saveJson(key, payload) {
  localStorage.setItem(key, JSON.stringify(payload));
}

function bootstrapUsers() {
  if (!localStorage.getItem(AUTH_USERS_KEY)) saveJson(AUTH_USERS_KEY, []);
}

function sanitizeChatStore(store) {
  if (!store || typeof store !== 'object' || Array.isArray(store)) return { General: [] };
  const cleaned = {};
  for (const [chatName, entries] of Object.entries(store)) {
    if (!Array.isArray(entries)) continue;
    cleaned[chatName] = entries.map((entry) => ({
      dir: entry?.dir === 'incoming' ? 'incoming' : 'outgoing',
      text: typeof entry?.text === 'string' ? entry.text : '',
      files: Array.isArray(entry?.files) ? entry.files.filter((f) => f?.name).map(normalizeStoredFile) : [],
      ts: Number.isFinite(entry?.ts) ? entry.ts : Date.now()
    }));
  }
  return Object.keys(cleaned).length ? cleaned : { General: [] };
}

function normalizeStoredFile(file) {
  return {
    name: file.name,
    type: typeof file.type === 'string' ? file.type : 'application/octet-stream',
    size: Number.isFinite(file.size) ? file.size : 0,
    dataUrl: typeof file.dataUrl === 'string' ? file.dataUrl : ''
  };
}

function sanitizeUploads(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item && typeof item === 'object' && typeof item.type === 'string')
    .map((item) => ({
      id: item.id || crypto.randomUUID(),
      type: item.type,
      userName: typeof item.userName === 'string' ? item.userName : 'User',
      caption: typeof item.caption === 'string' ? item.caption : '',
      description: typeof item.description === 'string' ? item.description : '',
      createdAt: item.createdAt || new Date().toISOString(),
      expiresAt: item.expiresAt || null,
      files: Array.isArray(item.files) ? item.files.filter((f) => f?.name).map(normalizeStoredFile) : []
    }));
}

function bindEvents() {
  signupForm.addEventListener('submit', onSignup);
  loginForm.addEventListener('submit', onLogin);
  logoutBtn.addEventListener('click', onLogout);
  themeToggle.addEventListener('click', toggleTheme);

  navButtons.forEach((button) => button.addEventListener('click', () => openTab(button.dataset.tab)));

  uploadTypeRow.addEventListener('click', (event) => {
    const btn = event.target.closest('.type-btn');
    if (!btn) return;
    selectedUploadType = btn.dataset.type;
    [...uploadTypeRow.querySelectorAll('.type-btn')].forEach((b) => b.classList.toggle('active', b === btn));
    applyUploadType();
  });

  uploadForm.addEventListener('submit', onUploadSubmit);

  newChatBtn.addEventListener('click', createNewChat);
  deleteChatBtn.addEventListener('click', deleteCurrentChat);

  chatMenuBtn.addEventListener('click', () => { chatMenu.hidden = !chatMenu.hidden; });
  document.addEventListener('click', (event) => {
    if (!chatMenu.contains(event.target) && event.target !== chatMenuBtn) chatMenu.hidden = true;
  });

  fileInput.addEventListener('change', async (event) => {
    pendingFiles = await normalizeFiles([...event.target.files]);
    renderAttachmentPreview();
  });

  chatForm.addEventListener('submit', async (event) => { event.preventDefault(); await sendMessage(); });

  backupNowBtn.addEventListener('click', () => { exportBackupFile(); chatMenu.hidden = true; });
  shareBackupBtn.addEventListener('click', async () => { await saveBackupToMobile(); chatMenu.hidden = true; });
  importBackupBtn.addEventListener('click', () => { backupInput.click(); chatMenu.hidden = true; });
  backupInput.addEventListener('change', importBackupFile);

  closeStoryViewer.addEventListener('click', () => { storyViewer.hidden = true; });
  prevStory.addEventListener('click', () => showStoryByIndex(activeStoryIndex - 1));
  nextStory.addEventListener('click', () => showStoryByIndex(activeStoryIndex + 1));
}

function applyUploadType() {
  const rule = typeRules[selectedUploadType];
  uploadFiles.accept = rule.accept;
  uploadFiles.multiple = rule.multiple;
  uploadHint.textContent = rule.hint;
  if (selectedUploadType === 'ltv') {
    uploadDescription.required = true;
    uploadDescription.placeholder = 'Description (required for LTV)';
  } else {
    uploadDescription.required = false;
    uploadDescription.placeholder = 'Description (optional for LTV)';
  }
}

function onSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) return setAuthMessage('Please fill all signup fields.', false);

  const users = loadJson(AUTH_USERS_KEY, []);
  if (users.some((u) => u.email === email)) return setAuthMessage('Email already exists. Please login.', false);

  users.push({ id: crypto.randomUUID(), name, email, password, role: 'user' });
  saveJson(AUTH_USERS_KEY, users);
  signupForm.reset();
  setAuthMessage('Signup successful. You can now login.', true);
}

function onLogin(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  const users = loadJson(AUTH_USERS_KEY, []);
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) return setAuthMessage('Invalid email/password.', false);

  saveJson(AUTH_SESSION_KEY, { id: found.id, name: found.name, email: found.email, role: found.role });
  setAuthMessage('', false);
  loadSession();
  openTab('home');
}

function setAuthMessage(message, success) {
  authMessage.style.color = success ? '#0f8a3a' : '#d14343';
  authMessage.textContent = message;
}

function loadSession() {
  activeSession = loadJson(AUTH_SESSION_KEY, null);
  if (!activeSession?.id) {
    authGate.hidden = false;
    appShell.hidden = true;
    return;
  }
  authGate.hidden = true;
  appShell.hidden = false;
  renderHome();
  renderUploads();
}

function onLogout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  activeSession = null;
  loadSession();
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

function openTab(tabId) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === tabId));
  navButtons.forEach((button) => button.classList.toggle('active', button.dataset.tab === tabId));
}

function renderHome() {
  renderStories();
  renderFeed();
}

function liveStories() {
  const now = Date.now();
  return uploads.filter((u) => u.type === 'story' && u.expiresAt && new Date(u.expiresAt).getTime() > now);
}

function renderStories() {
  const stories = liveStories();
  storiesRow.innerHTML = '';

  if (!stories.length) {
    storiesRow.innerHTML = '<p>No stories yet from registered users.</p>';
    return;
  }

  const byUser = new Map();
  stories.forEach((s) => {
    if (!byUser.has(s.userName)) byUser.set(s.userName, []);
    byUser.get(s.userName).push(s);
  });

  for (const [userName, items] of byUser.entries()) {
    const initials = userName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
    const card = document.createElement('div');
    card.className = 'story';
    card.innerHTML = `<div class="avatar">${escapeHtml(initials || 'U')}</div><p>${escapeHtml(userName)}</p>`;
    card.addEventListener('click', () => openStoryViewer(items, 0));
    storiesRow.appendChild(card);
  }
}

function renderFeed() {
  feedList.innerHTML = '';
  const items = uploads
    .filter((u) => u.type !== 'story')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!items.length) {
    feedList.innerHTML = '<article class="feed-card glass"><p>No uploads yet. Use Post tab to upload Shorts, Carousel, or LTV.</p></article>';
    return;
  }

  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'feed-card glass';

    const media = renderFeedMedia(item);
    article.innerHTML = `
      <div class="feed-type">${item.type.toUpperCase()} · ${escapeHtml(item.userName)}</div>
      ${media}
      <div class="feed-meta">
        <p><strong>${escapeHtml(item.caption)}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
    `;

    feedList.appendChild(article);
  });
}

function renderFeedMedia(item) {
  if (!item.files.length) return '<div class="media">No media</div>';

  if (item.type === 'carousel') {
    const imgs = item.files.map((f) => `<img src="${f.dataUrl}" alt="${escapeAttr(f.name)}" />`).join('');
    return `<div class="carousel-row">${imgs}</div>`;
  }

  const first = item.files[0];
  if (first.type.startsWith('image/')) return `<div class="media"><img src="${first.dataUrl}" alt="${escapeAttr(first.name)}" /></div>`;
  if (first.type.startsWith('video/')) return `<div class="media"><video src="${first.dataUrl}" controls></video></div>`;
  return `<div class="media">${fileIcon(first.type)} ${escapeHtml(first.name)}</div>`;
}

async function onUploadSubmit(event) {
  event.preventDefault();
  if (!activeSession) return;

  const caption = uploadCaption.value.trim();
  const description = uploadDescription.value.trim();
  const files = [...uploadFiles.files];
  if (!caption || !files.length) {
    uploadStatus.textContent = 'Add caption and required files.';
    return;
  }

  if (!validateUploadForType(selectedUploadType, files, description)) return;

  const prepared = await normalizeFiles(files);
  const createdAt = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    type: selectedUploadType,
    userName: activeSession.name,
    caption,
    description,
    createdAt,
    expiresAt: selectedUploadType === 'story' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
    files: prepared
  };

  uploads.unshift(record);
  saveJson(UPLOAD_STORE_KEY, uploads);

  uploadForm.reset();
  applyUploadType();
  uploadStatus.textContent = `Uploaded ${selectedUploadType.toUpperCase()} successfully.`;
  renderUploads();
  renderHome();
}

function validateUploadForType(type, files, description) {
  const invalid = (msg) => {
    uploadStatus.textContent = msg;
    return false;
  };

  if (type === 'short' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return invalid('Shorts require exactly 1 video.');
  if (type === 'carousel' && (!files.length || files.some((f) => !f.type.startsWith('image/')))) return invalid('Carousel requires image files only.');
  if (type === 'ltv' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return invalid('LTV requires exactly 1 video.');
  if (type === 'ltv' && !description) return invalid('LTV requires description.');
  if (type === 'story' && files.length !== 1) return invalid('Story requires exactly 1 image/video.');
  if (type === 'story' && !files[0].type.startsWith('image/') && !files[0].type.startsWith('video/')) return invalid('Story must be image or video.');
  return true;
}

function renderUploads() {
  uploadList.innerHTML = '';
  const mine = activeSession ? uploads.filter((u) => u.userName === activeSession.name) : [];

  if (!mine.length) {
    uploadList.innerHTML = '<div class="upload-item glass"><p>No uploads yet for your account.</p></div>';
    return;
  }

  mine.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'upload-item glass';
    const files = item.files
      .map((f) => `<li>${fileIcon(f.type)} <a href="${f.dataUrl || '#'}" download="${escapeAttr(f.name)}">${escapeHtml(f.name)}</a> (${Math.ceil((f.size || 0) / 1024)} KB)</li>`)
      .join('');

    card.innerHTML = `<p><strong>${item.type.toUpperCase()}:</strong> ${escapeHtml(item.caption)}</p><ul>${files}</ul>`;
    uploadList.appendChild(card);
  });
}

function openStoryViewer(items, index) {
  activeStoryItems = items;
  showStoryByIndex(index);
  storyViewer.hidden = false;
}

function showStoryByIndex(index) {
  if (!activeStoryItems.length) return;
  activeStoryIndex = (index + activeStoryItems.length) % activeStoryItems.length;
  const story = activeStoryItems[activeStoryIndex];
  storyViewerUser.textContent = `${story.userName} · story ${activeStoryIndex + 1}/${activeStoryItems.length}`;

  const media = story.files[0];
  if (!media) {
    storyViewerMedia.innerHTML = '<p>No media</p>';
    return;
  }

  if (media.type.startsWith('image/')) {
    storyViewerMedia.innerHTML = `<img src="${media.dataUrl}" alt="story" />`;
  } else if (media.type.startsWith('video/')) {
    storyViewerMedia.innerHTML = `<video src="${media.dataUrl}" controls autoplay></video>`;
  } else {
    storyViewerMedia.innerHTML = `<p>${fileIcon(media.type)} ${escapeHtml(media.name)}</p>`;
  }
}

function renderChatUsers() {
  chatUsersWrap.innerHTML = '';
  Object.keys(chatStore).forEach((chatName) => {
    const latest = chatStore[chatName].at(-1);
    const btn = document.createElement('button');
    btn.className = `chat-user ${chatName === activeChat ? 'active' : ''}`;
    btn.innerHTML = `${escapeHtml(chatName)}<small>${escapeHtml(latest?.text || latest?.files?.[0]?.name || 'No messages yet')}</small>`;
    btn.addEventListener('click', () => {
      activeChat = chatName;
      renderChatUsers();
      renderMessages();
    });
    chatUsersWrap.appendChild(btn);
  });
}

function renderMessages() {
  if (!chatStore[activeChat]) chatStore[activeChat] = [];
  activeChatTitle.textContent = activeChat;
  messages.innerHTML = '';

  chatStore[activeChat].forEach((msg) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.dir}`;
    const fileMarkup = msg.files.length
      ? `<ul class="file-list">${msg.files.map((f) => `<li>${fileIcon(f.type)} <a href="${f.dataUrl || '#'}" download="${escapeAttr(f.name)}" target="_blank" rel="noopener noreferrer">${escapeHtml(f.name)}</a></li>`).join('')}</ul>`
      : '';
    bubble.innerHTML = `${escapeHtml(msg.text || '')}${fileMarkup}`;
    messages.appendChild(bubble);
  });

  messages.scrollTop = messages.scrollHeight;
}

function renderAttachmentPreview() {
  if (!pendingFiles.length) {
    attachmentPreview.hidden = true;
    attachmentPreview.innerHTML = '';
    return;
  }
  const rows = pendingFiles.map((file) => `<li>${fileIcon(file.type)} ${escapeHtml(file.name)} <small>(${Math.ceil(file.size / 1024)} KB)</small></li>`).join('');
  attachmentPreview.innerHTML = `<strong>Attachments (${pendingFiles.length})</strong><ul>${rows}</ul>`;
  attachmentPreview.hidden = false;
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text && !pendingFiles.length) return;
  if (!chatStore[activeChat]) chatStore[activeChat] = [];

  chatStore[activeChat].push({ dir: 'outgoing', text, files: [...pendingFiles], ts: Date.now() });
  saveJson(CHAT_STORE_KEY, chatStore);
  messageInput.value = '';
  fileInput.value = '';
  pendingFiles = [];
  renderAttachmentPreview();
  renderChatUsers();
  renderMessages();
}

function createNewChat() {
  const name = prompt('Enter chat name (person/group/channel):');
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (!chatStore[trimmed]) chatStore[trimmed] = [];
  activeChat = trimmed;
  saveJson(CHAT_STORE_KEY, chatStore);
  renderChatUsers();
  renderMessages();
}

function deleteCurrentChat() {
  if (!confirm(`Delete chat '${activeChat}'?`)) return;
  delete chatStore[activeChat];
  if (!Object.keys(chatStore).length) chatStore = { General: [] };
  activeChat = Object.keys(chatStore)[0];
  saveJson(CHAT_STORE_KEY, chatStore);
  renderChatUsers();
  renderMessages();
  chatMenu.hidden = true;
}

function exportBackupFile() {
  const payload = { exportedAt: new Date().toISOString(), source: 'chatbhar-local-web', chatStore, uploads };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chatbhar-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveBackupToMobile() {
  const payload = { exportedAt: new Date().toISOString(), source: 'chatbhar-local-web', chatStore, uploads };
  const file = new File([JSON.stringify(payload, null, 2)], 'chatbhar-mobile-backup.json', { type: 'application/json' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ title: 'ChatBhar backup', text: 'Save this backup to your mobile files.', files: [file] });
    return;
  }
  exportBackupFile();
}

function importBackupFile(event) {
  const selected = event.target.files[0];
  if (!selected) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      chatStore = sanitizeChatStore(parsed.chatStore);
      uploads = sanitizeUploads(parsed.uploads);
      activeChat = Object.keys(chatStore)[0] || 'General';
      if (!chatStore[activeChat]) chatStore[activeChat] = [];
      saveJson(CHAT_STORE_KEY, chatStore);
      saveJson(UPLOAD_STORE_KEY, uploads);
      renderChatUsers();
      renderMessages();
      renderUploads();
      renderHome();
    } catch {
      authMessage.textContent = 'Backup import failed.';
    }
  };
  reader.readAsText(selected);
}

function normalizeFiles(files) {
  return Promise.all(
    files.map((file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl: String(reader.result || '') });
        reader.onerror = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl: '' });
        reader.readAsDataURL(file);
      })
    )
  );
}

function fileIcon(type) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎞️';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📕';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return '🗜️';
  return '📄';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return String(value).replaceAll('"', '&quot;');
}
