const AUTH_USERS_KEY = 'chatbhar.users';
const AUTH_RESET_DONE_KEY = 'chatbhar.authResetDone';
const AUTH_SESSION_KEY = 'chatbhar.session';
const CHAT_STORE_KEY = 'chatbhar.chatStore';
const UPLOAD_STORE_KEY = 'chatbhar.uploads';

const authGate = document.getElementById('authGate');
const appShell = document.getElementById('appShell');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');

const usernameForm = document.getElementById('usernameForm');
const usernameInput = document.getElementById('usernameInput');
const existingUsernames = document.getElementById('existingUsernames');
const usernameCheckBtn = document.getElementById('usernameCheckBtn');
const usernameHint = document.getElementById('usernameHint');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');

const screens = [...document.querySelectorAll('.screen')];
const navButtons = [...document.querySelectorAll('.nav-btn')];

const storiesRow = document.getElementById('storiesRow');
const feedList = document.getElementById('feedList');
const exploreSearchInput = document.getElementById('exploreSearchInput');
const exploreUsersList = document.getElementById('exploreUsersList');

const uploadTypeRow = document.getElementById('uploadTypeRow');
const uploadForm = document.getElementById('uploadForm');
const uploadCaption = document.getElementById('uploadCaption');
const uploadDescription = document.getElementById('uploadDescription');
const uploadFiles = document.getElementById('uploadFiles');
const uploadHint = document.getElementById('uploadHint');
const uploadDropZone = document.getElementById('uploadDropZone');
const uploadSelectedPreview = document.getElementById('uploadSelectedPreview');
const uploadStatus = document.getElementById('uploadStatus');
const uploadProgressWrap = document.getElementById('uploadProgressWrap');
const uploadProgressBar = document.getElementById('uploadProgressBar');
const uploadList = document.getElementById('uploadList');
const clearUploadSelection = document.getElementById('clearUploadSelection');
const openCreativeSuite = document.getElementById('openCreativeSuite');

const channelContentList = document.getElementById('channelContentList');

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
const deleteChatBtn = document.getElementById('deleteChatBtn');
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatMenu = document.getElementById('chatMenu');

const storyViewer = document.getElementById('storyViewer');
const storyViewerUser = document.getElementById('storyViewerUser');
const storyViewerMedia = document.getElementById('storyViewerMedia');
const closeStoryViewer = document.getElementById('closeStoryViewer');
const prevStory = document.getElementById('prevStory');
const nextStory = document.getElementById('nextStory');

const creativeSuiteModal = document.getElementById('creativeSuiteModal');
const closeCreativeSuite = document.getElementById('closeCreativeSuite');
const suiteAssetList = document.getElementById('suiteAssetList');
const suitePreview = document.getElementById('suitePreview');
const trimStartInput = document.getElementById('trimStartInput');
const trimEndInput = document.getElementById('trimEndInput');
const overlayTextInput = document.getElementById('overlayTextInput');
const overlayColorInput = document.getElementById('overlayColorInput');
const saveCreativeSuite = document.getElementById('saveCreativeSuite');

const postViewer = document.getElementById('postViewer');
const closePostViewer = document.getElementById('closePostViewer');
const postViewerTitle = document.getElementById('postViewerTitle');
const postViewerMedia = document.getElementById('postViewerMedia');
const postViewerInteraction = document.getElementById('postViewerInteraction');

const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmCancel = document.getElementById('confirmCancel');
const confirmOk = document.getElementById('confirmOk');
const selectContactBtn = document.getElementById('selectContactBtn');
const createGroupBtn = document.getElementById('createGroupBtn');
const typingIndicator = document.getElementById('typingIndicator');
const viewOnceToggle = document.getElementById('viewOnceToggle');

const imagePreviewModal = document.getElementById('imagePreviewModal');
const imagePreviewBody = document.getElementById('imagePreviewBody');
const imagePreviewCancel = document.getElementById('imagePreviewCancel');
const imagePreviewSend = document.getElementById('imagePreviewSend');
const closeImagePreview = document.getElementById('closeImagePreview');

const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const contactList = document.getElementById('contactList');

const groupModal = document.getElementById('groupModal');
const closeGroupModal = document.getElementById('closeGroupModal');
const groupNameInput = document.getElementById('groupNameInput');
const groupContactList = document.getElementById('groupContactList');
const createGroupConfirm = document.getElementById('createGroupConfirm');

const typeRules = {
  short: { accept: 'video/*', multiple: false, hint: 'Shorts: choose 1 short-form video.', captionRequired: true, descriptionRequired: false },
  carousel: { accept: 'image/*', multiple: true, hint: 'Carousel: choose multiple images.', captionRequired: true, descriptionRequired: false },
  ltv: { accept: 'video/*', multiple: false, hint: 'LTV: choose 1 long-form video.', captionRequired: true, descriptionRequired: true },
  story: { accept: 'image/*,video/*', multiple: true, hint: 'Story: one or many image/video files (24h).', captionRequired: false, descriptionRequired: false }
};

let selectedUploadType = 'short';
let selectedUploadRawFiles = [];
let selectedUploadEdits = [];
let activeSuiteIndex = 0;
let pendingFiles = [];
let chatStore = loadJson(CHAT_STORE_KEY, { General: [] });
let activeChat = Object.keys(chatStore)[0] || 'General';
let chatMeta = loadJson('chatbhar.chatMeta', {});
let previewPendingMessage = null;
let typingTimeout = null;
const presenceBus = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('chatbhar-presence') : null;
let uploads = loadJson(UPLOAD_STORE_KEY, []);
let activeSession = null;
let uploads = loadJson(UPLOAD_STORE_KEY, []);
let activeSession = null;
let authUsers = [];
let activeStoryItems = [];
let activeStoryIndex = 0;
let activePostViewerId = null;
let confirmAction = null;

bootstrapUsers();
loadSession();
bindEvents();
applyUploadType();
renderChatUsers();
renderMessages();
renderUploads();
renderHome();
renderExploreUsers();
renderChannelManager();
initEnhancedMessaging();
initApp();

async function initApp() {
  bindEvents();
  await bootstrapUsers();
  await loadSession();
  applyUploadType();
  renderChatUsers();
  renderMessages();
  renderUploads();
  renderHome();
  await renderExploreUsers();
  renderChannelManager();
}

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try { return JSON.parse(raw); } catch { return structuredClone(fallback); }
}
function saveJson(key, payload) { localStorage.setItem(key, JSON.stringify(payload)); }
function bootstrapUsers() { if (!localStorage.getItem(AUTH_USERS_KEY)) saveJson(AUTH_USERS_KEY, []); }


function loadLocalAuthDb() {
  const data = loadJson(AUTH_USERS_KEY, { users: [] });
  if (Array.isArray(data)) return { users: [] };
  if (!data || !Array.isArray(data.users)) return { users: [] };
  return data;
}

function saveLocalAuthDb(db) {
  saveJson(AUTH_USERS_KEY, db);
}

function monthKey(ts) {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function ensureGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(String(email || '').toLowerCase());
}

function parseRequestBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { throw new Error('Invalid request payload. Please try again.'); }
  }
  if (typeof body === 'object') return body;
  return {};
}

function usernameChangesThisMonth(user) {
  const nowKey = monthKey(Date.now());
  return (user.usernameChangeLogs || []).filter((entry) => monthKey(entry.ts) === nowKey).length;
}

async function localApiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = parseRequestBody(options.body);
  const db = loadLocalAuthDb();

  if (path === '/api/admin/reset-signups' && method === 'POST') {
    saveLocalAuthDb({ users: [] });
    return { ok: true, message: 'All existing signups removed for fresh Gmail registration.' };
  }

  if (path === '/api/auth/users' && method === 'GET') {
    return {
      users: db.users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: 'user',
        username: (u.usernames || []).find((x) => x.id === u.activeUsernameId)?.value || '',
        usernames: u.usernames || []
      }))
    };
  }

  if (path === '/api/auth/signup' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    if (!name || !email || !password) throw new Error('Please fill all signup fields.');
    if (!ensureGmail(email)) throw new Error('Signup requires a valid @gmail.com address.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (db.users.some((u) => u.email === email)) throw new Error('Email already exists. Please login.');

    const user = { id: crypto.randomUUID(), name, email, password, usernames: [], usernameChangeLogs: [], activeUsernameId: null };
    db.users.push(user);
    saveLocalAuthDb(db);
    return { user: { id: user.id, name: user.name, email: user.email, usernames: [], username: '' } };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email/password.');
    const username = (user.usernames || []).find((x) => x.id === user.activeUsernameId)?.value || '';
    return { session: { id: user.id, name: user.name, email: user.email, role: 'user', username } };
  }

  if (path === '/api/usernames/check' && method === 'POST') {
    const username = String(body.username || '').trim().toLowerCase();
    if (!username) throw new Error('Username is required.');
    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username));
    if (exists) throw new Error('Username already taken');
    return { available: true };
  }

  if (path === '/api/usernames' && method === 'POST') {
    const user = db.users.find((u) => u.id === String(body.userId || ''));
    const username = String(body.username || '').trim();
    if (!user || !username) throw new Error('User and username are required.');
    if ((user.usernames || []).length >= 5) throw new Error('Maximum 5 usernames allowed per Gmail account.');
    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username.toLowerCase()));
    if (exists) throw new Error('Username already taken');
    const ts = Date.now();
    const item = { id: crypto.randomUUID(), value: username, createdAt: ts, updatedAt: ts };
    user.usernames.push(item);
    user.activeUsernameId = item.id;
    saveLocalAuthDb(db);
    return { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: item.value } };
  }

  if (path === '/api/auth/session/select-username' && method === 'POST') {
    const user = db.users.find((u) => u.id === String(body.userId || ''));
    const username = String(body.username || '').trim();
    if (!user) throw new Error('User not found.');
    const selected = (user.usernames || []).find((u) => u.value === username);
    if (!selected) throw new Error('Username not found for account.');
    user.activeUsernameId = selected.id;
    saveLocalAuthDb(db);
    return { session: { id: user.id, name: user.name, email: user.email, role: 'user', username: selected.value } };
  }

  if (path.startsWith('/api/usernames/') && method === 'PATCH') {
    const user = db.users.find((u) => u.id === String(body.userId || ''));
    const username = String(body.username || '').trim();
    const usernameId = path.split('/').pop();
    if (!user) throw new Error('User not found.');
    if (usernameChangesThisMonth(user) >= 3) throw new Error('Username change limit reached: only 3 changes per month.');
    const target = (user.usernames || []).find((u) => u.id === usernameId);
    if (!target) throw new Error('Username not found.');
    const exists = db.users.some((u) => (u.usernames || []).some((x) => x.value.toLowerCase() === username.toLowerCase() && x.id !== usernameId));
    if (exists) throw new Error('Username already taken');
    user.usernameChangeLogs = user.usernameChangeLogs || [];
    user.usernameChangeLogs.push({ ts: Date.now(), from: target.value, to: username });
    target.value = username;
    target.updatedAt = Date.now();
    saveLocalAuthDb(db);
    return { ok: true, username: target };
  }

  throw new Error('Request failed');
}

async function apiRequest(path, options = {}) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  };

  let response;
  try {
    response = await fetch(path, requestOptions);
  } catch (error) {
    if (path.startsWith('/api/')) return localApiRequest(path, options);
    throw error;
  }

  const contentType = response.headers.get('content-type') || '';
  const isApiPath = path.startsWith('/api/');
  const isHtmlResponse = contentType.includes('text/html');

  if (isApiPath && isHtmlResponse) {
    return localApiRequest(path, options);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (isApiPath && (!payload || !Object.keys(payload).length)) return localApiRequest(path, options);
    throw new Error(payload.error || 'Request failed');
  }
  return payload;
}

async function syncAuthUsers() {
  try {
    const payload = await apiRequest('/api/auth/users');
    authUsers = payload.users || [];
  } catch {
    authUsers = [];
  }
}
async function bootstrapUsers() {
  await syncAuthUsers();
}

function bindEvents() {
  signupForm.addEventListener('submit', onSignup);
  loginForm.addEventListener('submit', onLogin);
  usernameForm.addEventListener('submit', onCreateUsername);
  usernameCheckBtn.addEventListener('click', onCheckUsername);
  logoutBtn.addEventListener('click', onLogout);
  themeToggle.addEventListener('click', toggleTheme);
  navButtons.forEach((btn) => btn.addEventListener('click', () => openTab(btn.dataset.tab)));
  exploreSearchInput.addEventListener('input', () => renderExploreUsers(exploreSearchInput.value));

  uploadTypeRow.addEventListener('click', (event) => {
    const btn = event.target.closest('.type-btn');
    if (!btn) return;
    selectedUploadType = btn.dataset.type;
    [...uploadTypeRow.querySelectorAll('.type-btn')].forEach((b) => b.classList.toggle('active', b === btn));
    applyUploadType();
  });

  uploadDropZone.addEventListener('click', () => uploadFiles.click());
  uploadDropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      uploadFiles.click();
    }
  });
  uploadDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDropZone.classList.add('dragover');
  });
  uploadDropZone.addEventListener('dragleave', () => uploadDropZone.classList.remove('dragover'));
  uploadDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDropZone.classList.remove('dragover');
    setSelectedUploadFiles([...e.dataTransfer.files]);
  });
  uploadFiles.addEventListener('change', (e) => setSelectedUploadFiles([...e.target.files]));
  clearUploadSelection.addEventListener('click', clearUploadSelectionState);
  openCreativeSuite.addEventListener('click', () => {
    if (!selectedUploadRawFiles.length) return;
    openCreativeSuiteModal();
  });
  uploadForm.addEventListener('submit', onUploadSubmit);

  closeCreativeSuite.addEventListener('click', () => (creativeSuiteModal.hidden = true));
  saveCreativeSuite.addEventListener('click', () => {
    syncSuiteFields();
    creativeSuiteModal.hidden = true;
  });
  [trimStartInput, trimEndInput, overlayTextInput, overlayColorInput].forEach((input) => {
    input.addEventListener('input', () => {
      syncSuiteFields();
      renderSuitePreview();
    });
  });

  closePostViewer.addEventListener('click', () => (postViewer.hidden = true));

  confirmCancel.addEventListener('click', () => {
    confirmModal.hidden = true;
    confirmAction = null;
  });
  confirmOk.addEventListener('click', () => {
    if (confirmAction) confirmAction();
    confirmModal.hidden = true;
    confirmAction = null;
  });

  if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);
  newChatBtn.addEventListener('click', createNewChat);
  deleteChatBtn.addEventListener('click', deleteCurrentChat);
  chatMenuBtn.addEventListener('click', () => (chatMenu.hidden = !chatMenu.hidden));
  document.addEventListener('click', (e) => {
    if (!chatMenu.contains(e.target) && e.target !== chatMenuBtn) chatMenu.hidden = true;
  });

  fileInput.addEventListener('change', async (e) => {
    pendingFiles = await normalizeFiles([...e.target.files]);
    renderAttachmentPreview();
  });
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendMessage();
  });

  backupNowBtn.addEventListener('click', () => {
    exportBackupFile();
    chatMenu.hidden = true;
  });
  shareBackupBtn.addEventListener('click', async () => {
    await saveBackupToMobile();
    chatMenu.hidden = true;
  });
  importBackupBtn.addEventListener('click', () => {
    backupInput.click();
    chatMenu.hidden = true;
  });
  backupInput.addEventListener('change', importBackupFile);

  closeStoryViewer.addEventListener('click', () => (storyViewer.hidden = true));
  prevStory.addEventListener('click', () => showStoryByIndex(activeStoryIndex - 1));
  nextStory.addEventListener('click', () => showStoryByIndex(activeStoryIndex + 1));
}


function activeHandle() { return activeSession?.username || activeSession?.name || 'User'; }

function applyUploadType() {
  const rule = typeRules[selectedUploadType];
  uploadFiles.accept = rule.accept;
  uploadFiles.multiple = rule.multiple;
  uploadHint.textContent = rule.hint;
  uploadCaption.required = rule.captionRequired;
  uploadDescription.required = rule.descriptionRequired;
}

function onSignup(event) {
async function onSignup(event) {
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
  renderExploreUsers();
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
  if (!email.endsWith('@gmail.com')) return setAuthMessage('Signup requires a valid @gmail.com address.', false);
  if (password.length < 8) return setAuthMessage('Password must be at least 8 characters.', false);

  try {
    const payload = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    signupForm.reset();
    setAuthMessage('Account created. Choose your username to continue.', true);
    await syncAuthUsers();
    openOnboarding(payload.user);
  } catch (error) {
    setAuthMessage(error.message, false);
  }
}

async function onLogin(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  try {
    const payload = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    saveJson(AUTH_SESSION_KEY, payload.session);
    if (!payload.session.username) {
      openOnboarding(payload.session);
      setAuthMessage('Pick a username before entering ChatBhar.', true);
      return;
    }
    setAuthMessage('', false);
    await loadSession();
    openTab('home');
  } catch (error) {
    setAuthMessage(error.message || 'Invalid email/password.', false);
  }
}

function openOnboarding(user) {
  activeSession = { id: user.id, name: user.name, email: user.email, role: user.role || 'user', username: user.username || '' };
  signupForm.hidden = true;
  loginForm.hidden = true;
  usernameForm.hidden = false;
  usernameHint.textContent = '';
  usernameInput.value = '';
  const usernames = user.usernames || [];
  existingUsernames.innerHTML = '<option value="">Choose existing username</option>';
  usernames.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.value;
    option.textContent = entry.value;
    existingUsernames.appendChild(option);
  });
}

async function onCheckUsername() {
  const username = usernameInput.value.trim();
  if (!username) return;
  try {
    await apiRequest('/api/usernames/check', { method: 'POST', body: JSON.stringify({ username }) });
    usernameHint.textContent = 'Username is available.';
    usernameHint.style.color = '#0f8a3a';
  } catch (error) {
    usernameHint.textContent = error.message;
    usernameHint.style.color = '#d14343';
  }
}

async function onCreateUsername(event) {
  event.preventDefault();
  const picked = existingUsernames.value.trim();
  const username = usernameInput.value.trim();

  try {
    let payload;
    if (picked) {
      payload = await apiRequest('/api/auth/session/select-username', {
        method: 'POST',
        body: JSON.stringify({ userId: activeSession.id, username: picked })
      });
    } else {
      payload = await apiRequest('/api/usernames', {
        method: 'POST',
        body: JSON.stringify({ userId: activeSession.id, username })
      });
    }

    saveJson(AUTH_SESSION_KEY, payload.session);
    usernameForm.hidden = true;
    signupForm.hidden = false;
    loginForm.hidden = false;
    setAuthMessage('', false);
    await syncAuthUsers();
    await loadSession();
    openTab('home');
  } catch (error) {
    setAuthMessage(error.message, false);
  }
}

function setAuthMessage(message, success) {
  authMessage.style.color = success ? '#0f8a3a' : '#d14343';
  authMessage.textContent = message;
}

function loadSession() {
async function loadSession() {
  activeSession = loadJson(AUTH_SESSION_KEY, null);
  if (!activeSession?.id) {
    authGate.hidden = false;
    appShell.hidden = true;
    return;
  }
  authGate.hidden = true;
  appShell.hidden = false;
  renderHome();
  renderExploreUsers();
  renderUploads();
  renderChannelManager();
initEnhancedMessaging();
    usernameForm.hidden = true;
    signupForm.hidden = false;
    loginForm.hidden = false;
    return;
  }

  await syncAuthUsers();
  const dbUser = authUsers.find((u) => u.id === activeSession.id);
  if (!dbUser) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    activeSession = null;
    authGate.hidden = false;
    appShell.hidden = true;
    return;
  }

  if (!activeSession.username) {
    authGate.hidden = false;
    appShell.hidden = true;
    openOnboarding(dbUser);
    return;
  }

  authGate.hidden = true;
  appShell.hidden = false;
  renderHome();
  await renderExploreUsers();
  renderUploads();
  renderChannelManager();
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
  screens.forEach((s) => s.classList.toggle('active', s.id === tabId));
  navButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === tabId));
}

function setSelectedUploadFiles(files) {
  selectedUploadRawFiles = files;
  selectedUploadEdits = files.map((f) => ({
    name: f.name,
    trimStart: 0,
    trimEnd: 0,
    overlayText: '',
    overlayColor: '#ffffff',
    overlayX: 10,
    overlayY: 10
  }));
  renderUploadSelectedPreview();
}

function clearUploadSelectionState() {
  selectedUploadRawFiles = [];
  selectedUploadEdits = [];
  uploadFiles.value = '';
  uploadSelectedPreview.innerHTML = '';
}

function renderUploadSelectedPreview() {
  uploadSelectedPreview.innerHTML = '';
  selectedUploadRawFiles.forEach((file, i) => {
    const card = document.createElement('div');
    card.className = 'selected-item';
    card.innerHTML = `${renderMediaPreview(file, i)}<div>${fileIcon(file.type)} ${escapeHtml(file.name)}</div>`;
    uploadSelectedPreview.appendChild(card);
  });
}

function renderMediaPreview(file, i) {
  const ratioClass = file.type.startsWith('image/') ? 'media-9x16' : 'media-16x9';
  const src = URL.createObjectURL(file);
  if (file.type.startsWith('image/')) return `<div class="${ratioClass}"><img src="${src}" alt="preview" loading="lazy" /></div>`;
  if (file.type.startsWith('video/')) return `<div class="${ratioClass}"><video src="${src}" muted preload="metadata"></video></div>`;
  return `<div class="media-16x9">${fileIcon(file.type)} file ${i + 1}</div>`;
}

function openCreativeSuiteModal() {
  creativeSuiteModal.hidden = false;
  activeSuiteIndex = 0;
  renderSuiteAssetList();
  loadSuiteFields();
  renderSuitePreview();
}

function renderSuiteAssetList() {
  suiteAssetList.innerHTML = '';
  selectedUploadRawFiles.forEach((file, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `suite-asset-item ${i === activeSuiteIndex ? 'active' : ''}`;
    item.textContent = `${i + 1}. ${file.name}`;
    item.addEventListener('click', () => {
      syncSuiteFields();
      activeSuiteIndex = i;
      renderSuiteAssetList();
      loadSuiteFields();
      renderSuitePreview();
    });
    suiteAssetList.appendChild(item);
  });
}

function loadSuiteFields() {
  const edit = selectedUploadEdits[activeSuiteIndex];
  if (!edit) return;
  trimStartInput.value = edit.trimStart;
  trimEndInput.value = edit.trimEnd;
  overlayTextInput.value = edit.overlayText;
  overlayColorInput.value = edit.overlayColor;
}

function syncSuiteFields() {
  const edit = selectedUploadEdits[activeSuiteIndex];
  if (!edit) return;
  edit.trimStart = Number(trimStartInput.value || 0);
  edit.trimEnd = Number(trimEndInput.value || 0);
  edit.overlayText = overlayTextInput.value;
  edit.overlayColor = overlayColorInput.value;
}

function renderSuitePreview() {
  const file = selectedUploadRawFiles[activeSuiteIndex];
  const edit = selectedUploadEdits[activeSuiteIndex];
  if (!file || !edit) {
    suitePreview.innerHTML = '';
    return;
  }

  const src = URL.createObjectURL(file);
  const ratioClass = file.type.startsWith('image/') ? 'media-9x16' : 'media-16x9';
  suitePreview.innerHTML = file.type.startsWith('image/')
    ? `<div class="${ratioClass}"><img src="${src}" alt="suite" /></div>`
    : `<div class="${ratioClass}"><video src="${src}" controls muted></video></div>`;

  if (edit.overlayText) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-text';
    overlay.textContent = edit.overlayText;
    overlay.style.color = edit.overlayColor;
    overlay.style.left = `${edit.overlayX}%`;
    overlay.style.top = `${edit.overlayY}%`;
    makeOverlayDraggable(overlay, edit);
    suitePreview.appendChild(overlay);
  }
}

function makeOverlayDraggable(el, edit) {
  let dragging = false;
  el.addEventListener('pointerdown', () => {
    dragging = true;
    el.setPointerCapture?.(1);
  });
  suitePreview.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = suitePreview.getBoundingClientRect();
    edit.overlayX = Math.max(0, Math.min(90, ((e.clientX - r.left) / r.width) * 100));
    edit.overlayY = Math.max(0, Math.min(90, ((e.clientY - r.top) / r.height) * 100));
    el.style.left = `${edit.overlayX}%`;
    el.style.top = `${edit.overlayY}%`;
  });
  const stop = () => (dragging = false);
  suitePreview.addEventListener('pointerup', stop);
  suitePreview.addEventListener('pointerleave', stop);
}

async function onUploadSubmit(event) {
  event.preventDefault();
  if (!activeSession) return;

  const caption = uploadCaption.value.trim();
  const description = uploadDescription.value.trim();
  const files = [...selectedUploadRawFiles];
  if (!files.length) {
    uploadStatus.textContent = 'Add required files.';
    return;
  }
  if (!validateUploadForType(selectedUploadType, files, caption, description)) return;

  uploadProgressWrap.hidden = false;
  uploadProgressBar.style.width = '0%';

  const prepared = await chunkedConcurrentUpload(files, updateProgress);
  const edits = structuredClone(selectedUploadEdits);

  const baseRecord = {
    type: selectedUploadType,
    userName: activeSession.name,
    userName: activeHandle(),
    caption,
    description,
    createdAt: new Date().toISOString(),
    interactions: { likes: 0, likedBy: [], comments: [] }
  };

  if (selectedUploadType === 'story') {
    prepared.forEach((file, idx) => {
      uploads.unshift({
        ...baseRecord,
        id: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        files: [file],
        edits: [edits[idx] || defaultEdit(file.name)]
      });
    });
  } else {
    uploads.unshift({
      ...baseRecord,
      id: crypto.randomUUID(),
      expiresAt: null,
      files: prepared,
      edits
    });
  }

  saveJson(UPLOAD_STORE_KEY, uploads);
  uploadForm.reset();
  clearUploadSelectionState();
  applyUploadType();
  uploadStatus.textContent = 'Upload complete.';
  uploadProgressWrap.hidden = true;
  uploadProgressBar.style.width = '0%';
  renderUploads();
  renderHome();
  renderChannelManager();
initEnhancedMessaging();
}

function updateProgress(fraction) {
  uploadProgressBar.style.width = `${Math.round(fraction * 100)}%`;
}

async function chunkedConcurrentUpload(files, onProgress) {
  const chunkSize = 1024 * 512;
  const queues = [];
  let done = 0;
  const total = files.reduce((sum, f) => sum + Math.max(1, Math.ceil(f.size / chunkSize)), 0);

  for (const file of files) {
    const chunks = Math.max(1, Math.ceil(file.size / chunkSize));
    for (let i = 0; i < chunks; i += 1) {
      queues.push(async () => {
        await new Promise((r) => setTimeout(r, 18));
        done += 1;
        onProgress(done / total);
      });
    }
  }

  const workers = Array.from({ length: Math.min(4, queues.length) }, async () => {
    while (queues.length) {
      const task = queues.shift();
      if (task) await task();
    }
  });
  await Promise.all(workers);

  return normalizeFiles(files);
}

function defaultEdit(name) {
  return { name, trimStart: 0, trimEnd: 0, overlayText: '', overlayColor: '#ffffff', overlayX: 10, overlayY: 10 };
}

function validateUploadForType(type, files, caption, description) {
  const bad = (msg) => {
    uploadStatus.textContent = msg;
    return false;
  };

  if (type !== 'story' && !caption) return bad('Title/caption is required for this content type.');
  if (type === 'short' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return bad('Shorts require exactly 1 video.');
  if (type === 'carousel' && files.some((f) => !f.type.startsWith('image/'))) return bad('Carousel requires image files only.');
  if (type === 'ltv' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return bad('LTV requires exactly 1 video.');
  if (type === 'ltv' && !description) return bad('LTV requires description.');
  if (type === 'story' && files.some((f) => !f.type.startsWith('image/') && !f.type.startsWith('video/'))) return bad('Story accepts only image/video.');
  return true;
}


function renderExploreUsers(query = '') {
  const users = loadJson(AUTH_USERS_KEY, []);
async function renderExploreUsers(query = '') {
  if (!authUsers.length) await syncAuthUsers();
  const users = authUsers;
  const normalizedQuery = String(query).trim().toLowerCase();
  const now = Date.now();

  const byUserLatestUpload = new Map();
  uploads.forEach((item) => {
    if (!item?.userName) return;
    const ts = new Date(item.createdAt || 0).getTime() || 0;
    if (!byUserLatestUpload.has(item.userName) || ts > byUserLatestUpload.get(item.userName)) {
      byUserLatestUpload.set(item.userName, ts);
    }
  });

  const rows = users
    .filter((u) => {
      if (!normalizedQuery) return true;
      return u.name.toLowerCase().includes(normalizedQuery) || u.email.toLowerCase().includes(normalizedQuery);
    })
    .map((u) => {
      const lastUploadTs = byUserLatestUpload.get(u.name) || 0;
      const isActive = u.id === activeSession?.id || (lastUploadTs && now - lastUploadTs < 24 * 60 * 60 * 1000);
      return { ...u, isActive, lastUploadTs };
      return (u.name || '').toLowerCase().includes(normalizedQuery) || (u.email || '').toLowerCase().includes(normalizedQuery) || (u.username || '').toLowerCase().includes(normalizedQuery);
    })
    .map((u) => {
      const displayName = u.username || u.name;
      const lastUploadTs = byUserLatestUpload.get(displayName) || 0;
      const isActive = u.id === activeSession?.id || (lastUploadTs && now - lastUploadTs < 24 * 60 * 60 * 1000);
      return { ...u, displayName, isActive, lastUploadTs };
    })
    .sort((a, b) => Number(b.isActive) - Number(a.isActive) || (b.lastUploadTs - a.lastUploadTs));

  exploreUsersList.innerHTML = '';
  if (!rows.length) {
    exploreUsersList.innerHTML = '<div class="explore-user-card glass"><p>No users found.</p></div>';
    return;
  }

  rows.forEach((u) => {
    const initials = u.name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
    const initials = (u.displayName || 'User').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
    const card = document.createElement('div');
    card.className = 'explore-user-card glass';
    card.innerHTML = `
      <div class="explore-user-head">
        <div class="avatar">${escapeHtml(initials || 'U')}</div>
        <div>
          <strong>${escapeHtml(u.name)}</strong>
          <strong>${escapeHtml(u.displayName || u.name)}</strong>
          <p>${escapeHtml(u.email)}</p>
        </div>
      </div>
      <span class="status-pill ${u.isActive ? 'active' : 'inactive'}">${u.isActive ? 'Active now' : 'Offline'}</span>
    `;
    exploreUsersList.appendChild(card);
  });
}

function renderUploads() {
  uploadList.innerHTML = '';
  const mine = activeSession ? uploads.filter((u) => u.userName === activeSession.name) : [];
  const mine = activeSession ? uploads.filter((u) => u.userName === activeHandle()) : [];
  if (!mine.length) {
    uploadList.innerHTML = '<div class="upload-item glass"><p>No uploads yet for your account.</p></div>';
    return;
  }
  mine.slice(0, 8).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'upload-item glass';
    card.innerHTML = `<p><strong>${item.type.toUpperCase()}:</strong> ${escapeHtml(item.caption || '(No title)')}</p>`;
    uploadList.appendChild(card);
  });
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
  storiesRow.innerHTML = '';
  const stories = liveStories();
  if (!stories.length) {
    storiesRow.innerHTML = '<p>No stories yet from registered users.</p>';
    return;
  }

  const byUser = new Map();
  stories.forEach((s) => {
    if (!byUser.has(s.userName)) byUser.set(s.userName, []);
    byUser.get(s.userName).push(s);
  });

  for (const [name, items] of byUser.entries()) {
    const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    const el = document.createElement('div');
    el.className = 'story';
    el.innerHTML = `<div class="avatar">${escapeHtml(initials || 'U')}</div><p>${escapeHtml(name)}</p>`;
    el.addEventListener('click', () => openStoryViewer(items, 0));
    storiesRow.appendChild(el);
  }
}

function renderFeed() {
  feedList.innerHTML = '';
  const items = uploads.filter((u) => u.type !== 'story').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!items.length) {
    feedList.innerHTML = '<article class="feed-card glass"><p>No uploads yet. Use Post tab to publish.</p></article>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'feed-card glass';
    card.innerHTML = `
      <div class="feed-type">${item.type.toUpperCase()} · ${escapeHtml(item.userName)}</div>
      ${renderFeedMedia(item)}
      <div class="feed-meta">
        <p><strong>${escapeHtml(item.caption || '(No title)')}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
      ${renderInteractionBlock(item)}
    `;
    bindInteractionEvents(card, item.id);
    bindCardOpenViewer(card, item.id);
    feedList.appendChild(card);
  });
}

function renderFeedMedia(item) {
  const files = item.files || [];
  if (!files.length) return '<div class="media-16x9">No media</div>';

  if (item.type === 'carousel') {
    return `<div class="carousel-row">${files.map((f) => `<div class="media-9x16"><img src="${cdnUrl(f.dataUrl)}" loading="lazy" alt="${escapeAttr(f.name)}" /></div>`).join('')}</div>`;
  }

  const first = files[0];
  const edit = item.edits?.[0] || defaultEdit(first.name);
  const ratioClass = first.type.startsWith('image/') ? 'media-9x16' : 'media-16x9';
  const media = first.type.startsWith('video/')
    ? `<video src="${cdnUrl(first.dataUrl)}" loading="lazy" controls></video>`
    : `<img src="${cdnUrl(first.dataUrl)}" loading="lazy" alt="${escapeAttr(first.name)}" />`;
  const overlay = edit.overlayText ? `<div class="overlay-text" style="left:${edit.overlayX}%;top:${edit.overlayY}%;color:${edit.overlayColor}">${escapeHtml(edit.overlayText)}</div>` : '';
  return `<div class="${ratioClass}">${media}${overlay}</div>`;
}

function renderInteractionBlock(item) {
  const likes = item.interactions?.likes || 0;
  const comments = item.interactions?.comments || [];
  return `
    <div class="post-interaction" data-post-id="${item.id}">
      <div class="interaction-row">
        <button data-action="like">👍 ${likes}</button>
        <button data-action="share">↗ Share</button>
      </div>
      <div class="comment-list">${comments.map((c) => `<div class="comment-item"><strong>${escapeHtml(c.user)}</strong>: ${escapeHtml(c.text)}</div>`).join('')}</div>
      <div class="interaction-row">
        <input data-action="comment-input" type="text" placeholder="Add comment" />
        <button data-action="comment-send">Comment</button>
      </div>
    </div>
  `;
}

function bindInteractionEvents(root, postId) {
  const block = root.querySelector('.post-interaction');
  if (!block) return;
  block.querySelector('[data-action="like"]').addEventListener('click', () => likePost(postId));
  block.querySelector('[data-action="share"]').addEventListener('click', () => sharePost(postId));
  block.querySelector('[data-action="comment-send"]').addEventListener('click', () => addComment(postId, block.querySelector('[data-action="comment-input"]').value));
}

function bindCardOpenViewer(card, postId) {
  card.querySelectorAll('.media-16x9,.media-9x16,.carousel-row').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openPostViewer(postId));
  });
}

function likePost(postId) {
  const userId = activeSession?.id;
  if (!userId) return;
  uploads = uploads.map((u) => {
    if (u.id !== postId) return u;
    const interactions = u.interactions || { likes: 0, likedBy: [], comments: [] };
    const liked = interactions.likedBy.includes(userId);
    const likedBy = liked ? interactions.likedBy.filter((id) => id !== userId) : [...interactions.likedBy, userId];
    return { ...u, interactions: { ...interactions, likedBy, likes: likedBy.length } };
  });
  persistAndRerender(postId);
}

function addComment(postId, text) {
  const content = String(text || '').trim();
  if (!content || !activeSession) return;
  uploads = uploads.map((u) => {
    if (u.id !== postId) return u;
    const interactions = u.interactions || { likes: 0, likedBy: [], comments: [] };
    return {
      ...u,
      interactions: { ...interactions, comments: [...interactions.comments, { user: activeSession.name, text: content, ts: Date.now() }] }
      interactions: { ...interactions, comments: [...interactions.comments, { user: activeHandle(), text: content, ts: Date.now() }] }
    };
  });
  persistAndRerender(postId);
}

async function sharePost(postId) {
  const post = uploads.find((u) => u.id === postId);
  if (!post) return;
  const text = `${post.userName} · ${post.caption || '(No title)'}`;
  if (navigator.share) {
    try { await navigator.share({ title: 'ChatBhar Post', text }); } catch {}
  } else {
    alert('Share copied simulation: ' + text);
  }
}

function openPostViewer(postId) {
  activePostViewerId = postId;
  const post = uploads.find((u) => u.id === postId);
  if (!post) return;
  postViewerTitle.textContent = `${post.type.toUpperCase()} · ${post.userName}`;
  postViewerMedia.innerHTML = renderFeedMedia(post);
  postViewerInteraction.innerHTML = renderInteractionBlock(post);
  bindInteractionEvents(postViewer, postId);
  postViewer.hidden = false;
}

function persistAndRerender(postId) {
  saveJson(UPLOAD_STORE_KEY, uploads);
  renderHome();
  renderExploreUsers();
  renderChannelManager();
initEnhancedMessaging();
  renderUploads();
  if (!postViewer.hidden && activePostViewerId === postId) openPostViewer(postId);
}

function renderChannelManager() {
  channelContentList.innerHTML = '';
  if (!activeSession) return;
  const mine = uploads.filter((u) => u.userName === activeSession.name);
  const mine = uploads.filter((u) => u.userName === activeHandle());
  if (!mine.length) {
    channelContentList.innerHTML = '<div class="channel-card glass"><p>No channel content yet.</p></div>';
    return;
  }

  mine.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'channel-card glass';
    card.innerHTML = `
      <h4>${item.type.toUpperCase()} · ${escapeHtml(item.caption || '(No title)')}</h4>
      <div class="channel-actions">
        <input data-field="caption" value="${escapeAttr(item.caption || '')}" placeholder="Title" />
        <textarea data-field="description" placeholder="Description">${escapeHtml(item.description || '')}</textarea>
        <button data-action="save">Save metadata</button>
        <button data-action="suite">Edit in Creative Suite</button>
        <button data-action="delete">Delete post</button>
      </div>
    `;

    card.querySelector('[data-action="save"]').addEventListener('click', () => {
      const caption = card.querySelector('[data-field="caption"]').value.trim();
      const description = card.querySelector('[data-field="description"]').value.trim();
      updateUpload(item.id, { caption, description });
    });

    card.querySelector('[data-action="suite"]').addEventListener('click', async () => {
      selectedUploadRawFiles = await dataFilesToBlobs(item.files);
      selectedUploadEdits = item.edits?.length ? structuredClone(item.edits) : selectedUploadRawFiles.map((f) => defaultEdit(f.name));
      openCreativeSuiteModal();
      const saveHandler = () => {
        syncSuiteFields();
        updateUpload(item.id, { edits: structuredClone(selectedUploadEdits) });
        saveCreativeSuite.removeEventListener('click', saveHandler);
      };
      saveCreativeSuite.addEventListener('click', saveHandler);
    });

    card.querySelector('[data-action="delete"]').addEventListener('click', () => openConfirm('Delete this post permanently?', () => {
      uploads = uploads.filter((u) => u.id !== item.id);
      persistAllViews();
    }));

    channelContentList.appendChild(card);
  });
}

function openConfirm(message, action) {
  confirmMessage.textContent = message;
  confirmAction = action;
  confirmModal.hidden = false;
}

function updateUpload(id, patch) {
  uploads = uploads.map((u) => (u.id === id ? { ...u, ...patch } : u));
  persistAllViews();
}

function persistAllViews() {
  saveJson(UPLOAD_STORE_KEY, uploads);
  renderHome();
  renderExploreUsers();
  renderChannelManager();
initEnhancedMessaging();
  renderUploads();
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
  storyViewerUser.textContent = `${story.userName} · ${activeStoryIndex + 1}/${activeStoryItems.length}`;
  storyViewerMedia.innerHTML = renderFeedMedia(story);
}

function renderChatUsers() {
  chatUsersWrap.innerHTML = '';
  Object.keys(chatStore).forEach((name) => {
    const latest = chatStore[name].at(-1);
    const btn = document.createElement('button');
    btn.className = `chat-user ${name === activeChat ? 'active' : ''}`;
    btn.innerHTML = `${escapeHtml(name)}<small>${escapeHtml(latest?.text || latest?.files?.[0]?.name || 'No messages yet')}</small>`;
    btn.addEventListener('click', () => {
      activeChat = name;
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
    const files = msg.files?.length ? `<ul>${msg.files.map((f) => `<li>${escapeHtml(f.name)}</li>`).join('')}</ul>` : '';
    bubble.innerHTML = `${escapeHtml(msg.text || '')}${files}`;
    const messageText = document.createElement('span');
    messageText.textContent = msg.text || '';
    bubble.appendChild(messageText);

    if (msg.files?.length) {
      const fileList = document.createElement('ul');
      msg.files.forEach((f) => {
        const fileItem = document.createElement('li');
        fileItem.textContent = f.name;
        fileList.appendChild(fileItem);
      });
      bubble.appendChild(fileList);
    }

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
  attachmentPreview.hidden = false;
  attachmentPreview.innerHTML = `<strong>Attachments</strong><ul>${pendingFiles.map((f) => `<li>${escapeHtml(f.name)}</li>`).join('')}</ul>`;
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text && !pendingFiles.length) return;
  if (!chatStore[activeChat]) chatStore[activeChat] = [];
  chatStore[activeChat].push({ dir: 'outgoing', text, files: pendingFiles, ts: Date.now() });
  saveJson(CHAT_STORE_KEY, chatStore);

  if (presenceBus && activeSession) {
    const meta = chatMeta[activeChat];
    if (meta) {
      meta.participants.forEach(pId => {
        if (pId !== activeSession.id) {
          presenceBus.postMessage({
            type: 'message',
            toId: pId,
            fromId: activeChat,
            senderId: activeSession.id,
            senderName: activeHandle(),
            text: payload.text,
            files: payload.files,
            viewOnce: payload.viewOnce,
            ts
          });
        }
      });
    }
  }
  messageInput.value = '';
  fileInput.value = '';
  pendingFiles = [];
  renderAttachmentPreview();
  renderChatUsers();
  renderMessages();
}

function createNewChat() {
  const name = prompt('Enter chat name:');
  if (!name) return;
  const n = name.trim();
  if (!n) return;
  if (!chatStore[n]) chatStore[n] = [];
  activeChat = n;
  saveJson(CHAT_STORE_KEY, chatStore);
  renderChatUsers();
  renderMessages();
}

function deleteCurrentChat() {
  openConfirm(`Delete chat '${activeChat}'?`, () => {
    delete chatStore[activeChat];
    if (!Object.keys(chatStore).length) chatStore = { General: [] };
    activeChat = Object.keys(chatStore)[0];
    saveJson(CHAT_STORE_KEY, chatStore);
    renderChatUsers();
    renderMessages();
  });
}

function exportBackupFile() {
  const payload = { exportedAt: new Date().toISOString(), chatStore, uploads };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chatbhar-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function saveBackupToMobile() {
  const payload = { exportedAt: new Date().toISOString(), chatStore, uploads };
  const file = new File([JSON.stringify(payload, null, 2)], 'chatbhar-mobile-backup.json', { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ title: 'ChatBhar backup', files: [file] });
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
      chatStore = parsed.chatStore || { General: [] };
      uploads = parsed.uploads || [];
      activeChat = Object.keys(chatStore)[0] || 'General';
      saveJson(CHAT_STORE_KEY, chatStore);
      saveJson(UPLOAD_STORE_KEY, uploads);
      renderChatUsers();
      renderMessages();
      renderHome();
      renderExploreUsers();
      renderUploads();
      renderChannelManager();
initEnhancedMessaging();
    } catch {
      authMessage.textContent = 'Backup import failed.';
    }
  };
  reader.readAsText(selected);
}

function cdnUrl(url) {
  return url; // CDN-ready abstraction for future remote delivery
}

function normalizeFiles(files) {
  return Promise.all(files.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl: String(reader.result || '') });
    reader.onerror = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl: '' });
    reader.readAsDataURL(file);
  })));
}

async function dataFilesToBlobs(files) {
  const blobs = [];
  for (const f of files || []) {
    const res = await fetch(f.dataUrl);
    const blob = await res.blob();
    blobs.push(new File([blob], f.name, { type: f.type }));
  }
  return blobs;
}

function fileIcon(type) {
  if ((type || '').startsWith('image/')) return '🖼️';
  if ((type || '').startsWith('video/')) return '🎞️';
  if ((type || '').startsWith('audio/')) return '🎵';
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
function escapeAttr(value) { return String(value).replaceAll('"', '&quot;'); }


function initEnhancedMessaging() {
  ensureChatMeta();
  bindMessagingUI();
  renderChatUsers();
  renderMessages();
  announcePresence(true);
  window.addEventListener('beforeunload', () => announcePresence(false));

  if (presenceBus) {
    presenceBus.onmessage = (event) => {
      const msg = event.data || {};
      if (msg.type === 'presence' && msg.userId && msg.userId !== activeSession?.id) {
        Object.keys(chatMeta).forEach((chatId) => {
          if ((chatMeta[chatId].participants || []).includes(msg.userId)) chatMeta[chatId].online = msg.online;
        });
        saveJson('chatbhar.chatMeta', chatMeta);
        renderChatUsers();
        renderMessages();
      }
      if (msg.type === 'typing' && msg.chatId === activeChat && msg.userId !== activeSession?.id) {
        typingIndicator.textContent = msg.typing ? `${msg.name || 'User'} is typing...` : '';
      }
      if (msg.type === 'message' && msg.toId === activeSession?.id) {
        const chatId = msg.fromId.startsWith('group:') ? msg.fromId : `dm:${msg.senderId}`;
        if (!chatStore[chatId]) chatStore[chatId] = [];
        chatStore[chatId].push({
          dir: 'incoming',
          text: msg.text,
          files: msg.files,
          viewOnce: msg.viewOnce,
          viewOnceConsumed: false,
          ts: msg.ts,
          senderName: msg.senderName
        });
        saveJson(CHAT_STORE_KEY, chatStore);
        if (activeChat === chatId) {
          renderMessages();
        }
        renderChatUsers();
      }
    };
  }
}

function bindMessagingUI() {
  if (selectContactBtn) selectContactBtn.addEventListener('click', openContactModal);
  if (createGroupBtn) createGroupBtn.addEventListener('click', openGroupModal);
  if (closeContactModal) closeContactModal.addEventListener('click', () => (contactModal.hidden = true));
  if (closeGroupModal) closeGroupModal.addEventListener('click', () => (groupModal.hidden = true));
  if (createGroupConfirm) createGroupConfirm.addEventListener('click', createGroupChat);

  if (messageInput) {
    messageInput.addEventListener('keypress', () => {
      clearTimeout(typingTimeout);
      sendTyping(true);
      typingTimeout = setTimeout(() => sendTyping(false), 1200);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      maybeOpenImagePreview();
    });
  }

  if (closeImagePreview) closeImagePreview.addEventListener('click', closeImagePreviewModal);
  if (imagePreviewCancel) imagePreviewCancel.addEventListener('click', closeImagePreviewModal);
  if (imagePreviewSend) imagePreviewSend.addEventListener('click', () => {
    if (!previewPendingMessage) return;
    sendMessage(previewPendingMessage);
    closeImagePreviewModal();
  });
}

function ensureChatMeta() {
  Object.keys(chatStore).forEach((chatId) => {
    if (!chatMeta[chatId]) {
      chatMeta[chatId] = {
        id: chatId,
        name: chatId.startsWith('dm:') ? chatId : chatId.replace('group:', ''),
        participants: [],
        isGroup: chatId.startsWith('group:'),
        online: false
      };
    }
  });
  saveJson('chatbhar.chatMeta', chatMeta);
}

function openContactModal() {
  const users = loadJson(AUTH_USERS_KEY, []).filter((u) => u.id !== activeSession?.id);
  contactList.innerHTML = '';
  users.forEach((u) => {
    const row = document.createElement('div');
    row.className = 'contact-item';
    row.innerHTML = `<span>${escapeHtml(u.name)}</span><button type="button">Select</button>`;
    row.querySelector('button').addEventListener('click', () => {
      const id = `dm:${u.id}`;
      if (!chatStore[id]) chatStore[id] = [];
      chatMeta[id] = { id, name: u.name, participants: [u.id, activeSession.id], isGroup: false, online: true };
      saveJson(CHAT_STORE_KEY, chatStore);
      saveJson('chatbhar.chatMeta', chatMeta);
      activeChat = id;
      renderChatUsers();
      renderMessages();
      contactModal.hidden = true;
    });
    contactList.appendChild(row);
  });
  contactModal.hidden = false;
}

function openGroupModal() {
  const users = loadJson(AUTH_USERS_KEY, []).filter((u) => u.id !== activeSession?.id);
  groupContactList.innerHTML = '';
  users.forEach((u) => {
    const row = document.createElement('label');
    row.className = 'contact-item';
    row.innerHTML = `<span>${escapeHtml(u.name)}</span><input type="checkbox" value="${u.id}" />`;
    groupContactList.appendChild(row);
  });
  groupModal.hidden = false;
}

function createGroupChat() {
  const name = groupNameInput.value.trim();
  if (!name) return;
  const members = [...groupContactList.querySelectorAll('input:checked')].map((x) => x.value);
  if (!members.length) return;
  const id = `group:${name}-${Date.now()}`;
  chatStore[id] = [];
  chatMeta[id] = { id, name, participants: [activeSession.id, ...members], isGroup: true, online: true };
  saveJson(CHAT_STORE_KEY, chatStore);
  saveJson('chatbhar.chatMeta', chatMeta);
  activeChat = id;
  groupNameInput.value = '';
  groupModal.hidden = true;
  renderChatUsers();
  renderMessages();
}

function maybeOpenImagePreview() {
  if (!pendingFiles.length) return;
  const imageOnly = pendingFiles.every((f) => (f.type || '').startsWith('image/'));
  if (!imageOnly) return;
  imagePreviewBody.innerHTML = pendingFiles.map((f) => `<div class="media-9x16"><img src="${f.dataUrl}" alt="preview" /></div>`).join('');
  previewPendingMessage = { text: messageInput.value.trim(), files: [...pendingFiles], viewOnce: Boolean(viewOnceToggle?.checked) };
  imagePreviewModal.hidden = false;
}

function closeImagePreviewModal() {
  imagePreviewModal.hidden = true;
  previewPendingMessage = null;
}

function sendTyping(typing) {
  if (!presenceBus || !activeSession) return;
  presenceBus.postMessage({ type: 'typing', chatId: activeChat, userId: activeSession.id, name: activeSession.name, typing });
}

function announcePresence(online) {
  if (!presenceBus || !activeSession) return;
  presenceBus.postMessage({ type: 'presence', userId: activeSession.id, online });
}

function renderChatUsers() {
  if (!chatUsersWrap) return;
  chatUsersWrap.innerHTML = '';
  Object.keys(chatStore).forEach((chatId) => {
    const latest = chatStore[chatId].at(-1);
    const meta = chatMeta[chatId] || { name: chatId, online: false };
    const btn = document.createElement('button');
    btn.className = `chat-user ${chatId === activeChat ? 'active' : ''}`;
    const status = meta.online ? '🟢' : '⚪';
    const preview = latest?.text || latest?.files?.[0]?.name || 'No messages yet';
    btn.innerHTML = `${status} ${escapeHtml(meta.name)}<small>${escapeHtml(preview)}</small>`;
    btn.addEventListener('click', () => {
      activeChat = chatId;
      renderChatUsers();
      renderMessages();
    });
    chatUsersWrap.appendChild(btn);
  });
}

function renderMessages() {
  if (!messages) return;
  if (!chatStore[activeChat]) chatStore[activeChat] = [];
  const meta = chatMeta[activeChat] || { name: activeChat, online: false };
  activeChatTitle.textContent = meta.name;
  if (typingIndicator && !typingIndicator.textContent) typingIndicator.textContent = meta.online ? 'online' : 'offline';

  messages.innerHTML = '';
  chatStore[activeChat].forEach((msg, idx) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.dir}`;

    let fileHtml = '';
    (msg.files || []).forEach((f) => {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      const isImage = (f.type || '').startsWith('image/');
      const hideName = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

      if (isImage && msg.viewOnce && msg.viewOnceConsumed) {
        fileHtml += '<div class="view-once-placeholder">📷 Photo</div>';
        return;
      }

      if (isImage) {
        const ratio = f.width && f.height && f.width > f.height ? 'landscape' : '';
        fileHtml += `<div class="chat-image ${ratio}" data-open-img="${idx}"><img src="${f.dataUrl}" alt="img" loading="lazy" />${msg.viewOnce ? '<div class="view-once-badge">1x view once</div>' : ''}${hideName ? '' : `<small>${escapeHtml(f.name)}</small>`}</div>`;
      } else {
        const showName = ext === 'pdf' || !isImage;
        fileHtml += `<div>${fileIcon(f.type)} ${showName ? `<a href="${f.dataUrl}" download="${escapeAttr(f.name)}">${escapeHtml(f.name)}</a>` : ''}</div>`;
      }
    });

    bubble.innerHTML = `${escapeHtml(msg.text || '')}${fileHtml}`;
    messages.appendChild(bubble);
  });

  messages.querySelectorAll('[data-open-img]').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-open-img'));
      openImageFromMessage(idx);
    });
  });

  messages.scrollTop = messages.scrollHeight;
}

function openImageFromMessage(idx) {
  const msg = chatStore[activeChat][idx];
  const img = (msg.files || []).find((f) => (f.type || '').startsWith('image/'));
  if (!img) return;
  postViewerTitle.textContent = msg.viewOnce ? 'View Once Photo' : 'Photo';
  postViewerMedia.innerHTML = `<div class="media-9x16"><img src="${img.dataUrl}" alt="photo" /></div>`;
  postViewerInteraction.innerHTML = '';
  postViewer.hidden = false;

  if (msg.viewOnce && msg.dir === 'incoming' && !msg.viewOnceConsumed) {
    msg.viewOnceConsumed = true;
    msg.files = msg.files.map((f) => ({ ...f, dataUrl: '' }));
    saveJson(CHAT_STORE_KEY, chatStore);
    renderMessages();
  }
}

async function sendMessage(prepared = null) {
  const payload = prepared || { text: messageInput.value.trim(), files: pendingFiles, viewOnce: Boolean(viewOnceToggle?.checked) };
  if (!payload.text && !(payload.files || []).length) return;
  if (!chatStore[activeChat]) chatStore[activeChat] = [];
  chatStore[activeChat].push({ dir: 'outgoing', text: payload.text, files: payload.files, viewOnce: payload.viewOnce, viewOnceConsumed: false, ts: Date.now() });
  saveJson(CHAT_STORE_KEY, chatStore);
  messageInput.value = '';
  fileInput.value = '';
  pendingFiles = [];
  if (viewOnceToggle) viewOnceToggle.checked = false;
  renderAttachmentPreview();
  renderChatUsers();
  renderMessages();
}

function createNewChat() {}
  
  
  
