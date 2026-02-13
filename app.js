const AUTH_USERS_KEY = 'chatbhar.users';
const AUTH_SESSION_KEY = 'chatbhar.session';
const CHAT_STORE_KEY = 'chatbhar.chatStore';

const authGate = document.getElementById('authGate');
const appShell = document.getElementById('appShell');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');

const screens = [...document.querySelectorAll('.screen')];
const navButtons = [...document.querySelectorAll('.nav-btn')];
const quickButtons = [...document.querySelectorAll('.quick-card')];
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

let pendingFiles = [];
let chatStore = sanitizeChatStore(loadJson(CHAT_STORE_KEY, { General: [] }));
let activeChat = Object.keys(chatStore)[0] || 'General';

if (!chatStore[activeChat]) chatStore[activeChat] = [];

bootstrapUsers();
loadSession();
bindEvents();
renderChatUsers();
renderMessages();

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

function saveJson(key, payload) {
  localStorage.setItem(key, JSON.stringify(payload));
}

function bootstrapUsers() {
  if (!localStorage.getItem(AUTH_USERS_KEY)) {
    saveJson(AUTH_USERS_KEY, []);
  }
}

function sanitizeChatStore(store) {
  if (!store || typeof store !== 'object' || Array.isArray(store)) return { General: [] };

  const cleaned = {};
  for (const [chatName, entries] of Object.entries(store)) {
    if (!Array.isArray(entries)) continue;
    cleaned[chatName] = entries
      .filter((entry) => entry && typeof entry === 'object')
      .map((entry) => ({
        dir: entry.dir === 'incoming' ? 'incoming' : 'outgoing',
        text: typeof entry.text === 'string' ? entry.text : '',
        files: Array.isArray(entry.files)
          ? entry.files
              .filter((f) => f && typeof f.name === 'string')
              .map((f) => ({
                name: f.name,
                type: typeof f.type === 'string' ? f.type : 'application/octet-stream',
                size: Number.isFinite(f.size) ? f.size : 0,
                dataUrl: typeof f.dataUrl === 'string' ? f.dataUrl : ''
              }))
          : [],
        ts: Number.isFinite(entry.ts) ? entry.ts : Date.now()
      }));
  }

  if (!Object.keys(cleaned).length) return { General: [] };
  return cleaned;
}

function bindEvents() {
  signupForm.addEventListener('submit', onSignup);
  loginForm.addEventListener('submit', onLogin);
  logoutBtn.addEventListener('click', onLogout);
  themeToggle.addEventListener('click', toggleTheme);

  [...navButtons, ...quickButtons].forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tab));
  });

  newChatBtn.addEventListener('click', createNewChat);
  deleteChatBtn.addEventListener('click', deleteCurrentChat);

  chatMenuBtn.addEventListener('click', () => {
    chatMenu.hidden = !chatMenu.hidden;
  });

  document.addEventListener('click', (event) => {
    if (!chatMenu.contains(event.target) && event.target !== chatMenuBtn) {
      chatMenu.hidden = true;
    }
  });

  fileInput.addEventListener('change', async (event) => {
    pendingFiles = await normalizeFiles([...event.target.files]);
    renderAttachmentPreview();
  });

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
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
}

function onSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    authMessage.textContent = 'Please fill all signup fields.';
    return;
  }

  const users = loadJson(AUTH_USERS_KEY, []);
  if (users.some((u) => u.email === email)) {
    authMessage.textContent = 'Email already exists. Please login.';
    return;
  }

  users.push({ id: crypto.randomUUID(), name, email, password, role: 'user' });
  saveJson(AUTH_USERS_KEY, users);
  authMessage.style.color = '#0f8a3a';
  authMessage.textContent = 'Signup successful. You can now login.';
  signupForm.reset();
}

function onLogin(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  const users = loadJson(AUTH_USERS_KEY, []);
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    authMessage.style.color = '#d14343';
    authMessage.textContent = 'Invalid email/password.';
    return;
  }

  saveJson(AUTH_SESSION_KEY, { id: found.id, name: found.name, email: found.email, role: found.role });
  authMessage.textContent = '';
  loadSession();
  openTab('home');
}

function loadSession() {
  const session = loadJson(AUTH_SESSION_KEY, null);
  if (!session?.id) {
    authGate.hidden = false;
    appShell.hidden = true;
    return;
  }

  authGate.hidden = true;
  appShell.hidden = false;
}

function onLogout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
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
      ? `<ul class="file-list">${msg.files
          .map((f) => `<li>${fileIcon(f.type)} <a href="${f.dataUrl || '#'}" download="${escapeAttr(f.name)}" target="_blank" rel="noopener noreferrer">${escapeHtml(f.name)}</a> (${Math.ceil((f.size || 0) / 1024)} KB)</li>`)
          .join('')}</ul>`
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

  const rows = pendingFiles
    .map((file) => `<li>${fileIcon(file.type)} ${escapeHtml(file.name)} <small>(${Math.ceil(file.size / 1024)} KB)</small></li>`)
    .join('');

  attachmentPreview.innerHTML = `<strong>Attachments (${pendingFiles.length})</strong><ul>${rows}</ul>`;
  attachmentPreview.hidden = false;
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text && !pendingFiles.length) return;

  if (!chatStore[activeChat]) chatStore[activeChat] = [];

  chatStore[activeChat].push({
    dir: 'outgoing',
    text,
    files: [...pendingFiles],
    ts: Date.now()
  });

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
  const allChats = Object.keys(chatStore);
  if (!allChats.length) return;

  if (!confirm(`Delete chat '${activeChat}'?`)) return;

  delete chatStore[activeChat];

  if (!Object.keys(chatStore).length) {
    chatStore = { General: [] };
  }

  activeChat = Object.keys(chatStore)[0];
  saveJson(CHAT_STORE_KEY, chatStore);
  renderChatUsers();
  renderMessages();
  chatMenu.hidden = true;
}

function exportBackupFile() {
  const payload = {
    exportedAt: new Date().toISOString(),
    source: 'chatbhar-local-web',
    chatStore
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chatbhar-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function saveBackupToMobile() {
  const payload = {
    exportedAt: new Date().toISOString(),
    source: 'chatbhar-local-web',
    chatStore
  };

  const file = new File([JSON.stringify(payload, null, 2)], 'chatbhar-mobile-backup.json', {
    type: 'application/json'
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: 'ChatBhar backup',
      text: 'Save this backup to your mobile files.',
      files: [file]
    });
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
      activeChat = Object.keys(chatStore)[0] || 'General';
      if (!chatStore[activeChat]) chatStore[activeChat] = [];
      saveJson(CHAT_STORE_KEY, chatStore);
      renderChatUsers();
      renderMessages();
    } catch {
      authMessage.textContent = 'Backup import failed.';
    }
  };
  reader.readAsText(selected);
}

function normalizeFiles(files) {
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type || 'application/octet-stream',
              size: file.size,
              dataUrl: String(reader.result || '')
            });
          };
          reader.onerror = () => {
            resolve({
              name: file.name,
              type: file.type || 'application/octet-stream',
              size: file.size,
              dataUrl: ''
            });
          };
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
