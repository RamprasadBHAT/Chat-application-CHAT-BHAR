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
const uploadProgressWrap = document.getElementById('uploadProgressWrap');
const uploadProgressBar = document.getElementById('uploadProgressBar');
const uploadDropZone = document.getElementById('uploadDropZone');
const uploadSelectedPreview = document.getElementById('uploadSelectedPreview');
const clearUploadSelectionBtn = document.getElementById('clearUploadSelection');

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
  short: { accept: 'video/*', multiple: false, hint: 'Shorts: choose 1 short-form video.', captionRequired: true, descriptionRequired: false },
  carousel: { accept: 'image/*', multiple: true, hint: 'Carousel: choose multiple images.', captionRequired: true, descriptionRequired: false },
  ltv: { accept: 'video/*', multiple: false, hint: 'LTV: choose 1 long-form video.', captionRequired: true, descriptionRequired: true },
  story: { accept: 'image/*,video/*', multiple: false, hint: 'Story: choose 1 image/video (expires in 24h). Title & description optional.', captionRequired: false, descriptionRequired: false }
};

let selectedUploadType = 'short';
let pendingFiles = [];
let selectedUploadRawFiles = [];
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
renderChannelManager();

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
      thumbnail: item.thumbnail ? normalizeStoredFile(item.thumbnail) : null,
      trimStart: Number.isFinite(item.trimStart) ? item.trimStart : 0,
      trimEnd: Number.isFinite(item.trimEnd) ? item.trimEnd : 0,
      musicTrack: item.musicTrack ? normalizeStoredFile(item.musicTrack) : null,
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
  uploadFiles.addEventListener('change', (event) => setSelectedUploadFiles([...event.target.files]));
  clearUploadSelectionBtn.addEventListener('click', clearUploadSelection);

  uploadDropZone.addEventListener('click', () => uploadFiles.click());
  uploadDropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      uploadFiles.click();
    }
  });

  uploadDropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadDropZone.classList.add('dragover');
  });
  uploadDropZone.addEventListener('dragleave', () => uploadDropZone.classList.remove('dragover'));
  uploadDropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadDropZone.classList.remove('dragover');
    setSelectedUploadFiles([...event.dataTransfer.files]);
  });

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
  uploadCaption.required = rule.captionRequired;
  uploadDescription.required = rule.descriptionRequired;
  if (selectedUploadType === 'ltv') {
    uploadDescription.placeholder = 'Description (required for LTV)';
  } else if (selectedUploadType === 'story') {
    uploadDescription.placeholder = 'Description optional for stories';
  } else {
    uploadDescription.placeholder = 'Description (optional)';
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
  const items = uploads.filter((u) => u.type !== 'story').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
        <p><strong>${escapeHtml(item.caption || '(No title)')}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
    `;

    feedList.appendChild(article);
    attachVideoEnhancements(article, item);
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
  if (first.type.startsWith('video/')) {
    const poster = item.thumbnail?.dataUrl ? `poster="${item.thumbnail.dataUrl}"` : '';
    return `<div class="media"><video src="${first.dataUrl}" controls ${poster}></video></div>`;
  }
  return `<div class="media">${fileIcon(first.type)} ${escapeHtml(first.name)}</div>`;
}

function attachVideoEnhancements(container, item) {
  const video = container.querySelector('video');
  if (!video) return;

  if (item.trimStart > 0) {
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(item.trimStart, video.duration || item.trimStart);
    });
  }

  if (item.trimEnd > 0) {
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= item.trimEnd) video.pause();
    });
  }
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
  await fakeSmoothProgress();

  const prepared = await normalizeFiles(files);
  const record = {
    id: crypto.randomUUID(),
    type: selectedUploadType,
    userName: activeSession.name,
    caption,
    description,
    createdAt: new Date().toISOString(),
    expiresAt: selectedUploadType === 'story' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
    thumbnail: null,
    trimStart: 0,
    trimEnd: 0,
    musicTrack: null,
    files: prepared
  };

  uploads.unshift(record);
  saveJson(UPLOAD_STORE_KEY, uploads);

  uploadForm.reset();
  clearUploadSelection();
  applyUploadType();
  uploadStatus.textContent = `Uploaded ${selectedUploadType.toUpperCase()} successfully.`;
  uploadProgressWrap.hidden = true;
  uploadProgressBar.style.width = '0%';
  renderUploads();
  renderHome();
  renderChannelManager();
}


function setSelectedUploadFiles(files) {
  selectedUploadRawFiles = files;
  renderUploadSelectedPreview(files);
}

function clearUploadSelection() {
  selectedUploadRawFiles = [];
  uploadFiles.value = '';
  uploadSelectedPreview.innerHTML = '';
}

function renderUploadSelectedPreview(files) {
  uploadSelectedPreview.innerHTML = '';
  if (!files.length) return;

  files.forEach((file) => {
    const card = document.createElement('div');
    card.className = 'selected-item';

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      card.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      card.appendChild(video);
    }

    const meta = document.createElement('div');
    meta.textContent = `${fileIcon(file.type)} ${file.name}`;
    card.appendChild(meta);
    uploadSelectedPreview.appendChild(card);
  });
}

function validateUploadForType(type, files, caption, description) {
  const invalid = (msg) => {
    uploadStatus.textContent = msg;
    return false;
  };

  if (type !== 'story' && !caption) return invalid('Title/caption is required for this content type.');
  if (type === 'short' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return invalid('Shorts require exactly 1 video.');
  if (type === 'carousel' && (!files.length || files.some((f) => !f.type.startsWith('image/')))) return invalid('Carousel requires image files only.');
  if (type === 'ltv' && (files.length !== 1 || !files[0].type.startsWith('video/'))) return invalid('LTV requires exactly 1 video.');
  if (type === 'ltv' && !description) return invalid('LTV requires description.');
  if (type === 'story' && files.length !== 1) return invalid('Story requires exactly 1 image/video.');
  if (type === 'story' && !files[0].type.startsWith('image/') && !files[0].type.startsWith('video/')) return invalid('Story must be image or video.');
  return true;
}

function fakeSmoothProgress() {
  return new Promise((resolve) => {
    let val = 0;
    const int = setInterval(() => {
      val += 12;
      uploadProgressBar.style.width = `${Math.min(val, 96)}%`;
      if (val >= 96) {
        clearInterval(int);
        setTimeout(() => {
          uploadProgressBar.style.width = '100%';
          setTimeout(resolve, 120);
        }, 120);
      }
    }, 70);
  });
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
      .map((f) => `<li>${fileIcon(f.type)} <a href="${f.dataUrl || '#'}" download="${escapeAttr(f.name)}">${escapeHtml(f.name)}</a></li>`)
      .join('');

    card.innerHTML = `<p><strong>${item.type.toUpperCase()}:</strong> ${escapeHtml(item.caption || '(No title)')}</p><ul>${files}</ul>`;
    uploadList.appendChild(card);
  });
}

function renderChannelManager() {
  channelContentList.innerHTML = '';
  if (!activeSession) return;

  const mine = uploads.filter((u) => u.userName === activeSession.name);
  if (!mine.length) {
    channelContentList.innerHTML = '<div class="channel-card glass"><p>No channel content yet.</p></div>';
    return;
  }

  mine.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'channel-card glass';

    const isVideo = item.files[0]?.type?.startsWith('video/');

    card.innerHTML = `
      <h4>${item.type.toUpperCase()} · ${escapeHtml(item.caption || '(No title)')}</h4>
      <div class="video-meta">${escapeHtml(item.description || '')}</div>
      <div class="channel-actions">
        <input data-action="title" value="${escapeAttr(item.caption || '')}" placeholder="Edit title" />
        <textarea data-action="description" placeholder="Edit description">${escapeHtml(item.description || '')}</textarea>
        <button data-action="save-meta">Save title/description</button>
        ${isVideo ? '<input type="file" data-action="thumbnail" accept="image/*" />' : ''}
        ${isVideo ? '<input type="number" step="0.1" min="0" data-action="trim-start" placeholder="Trim start (sec)" />' : ''}
        ${isVideo ? '<input type="number" step="0.1" min="0" data-action="trim-end" placeholder="Trim end (sec)" />' : ''}
        ${isVideo ? '<input type="file" data-action="music" accept="audio/*" />' : ''}
        ${isVideo ? '<button data-action="save-video-tools">Save trim/music/thumbnail</button>' : ''}
        <button data-action="delete" class="danger">Delete content</button>
      </div>
    `;

    bindChannelCardActions(card, item.id, isVideo);
    channelContentList.appendChild(card);
  });
}

function bindChannelCardActions(card, id, isVideo) {
  card.querySelector('[data-action="save-meta"]').addEventListener('click', () => {
    const title = card.querySelector('[data-action="title"]').value.trim();
    const desc = card.querySelector('[data-action="description"]').value.trim();
    updateUpload(id, { caption: title, description: desc });
  });

  card.querySelector('[data-action="delete"]').addEventListener('click', () => {
    if (!confirm('Delete this content from your channel?')) return;
    uploads = uploads.filter((u) => u.id !== id);
    persistUploadViews();
  });

  if (!isVideo) return;

  card.querySelector('[data-action="save-video-tools"]').addEventListener('click', async () => {
    const trimStart = Number(card.querySelector('[data-action="trim-start"]').value || 0);
    const trimEnd = Number(card.querySelector('[data-action="trim-end"]').value || 0);

    const thumbInput = card.querySelector('[data-action="thumbnail"]');
    const musicInput = card.querySelector('[data-action="music"]');

    const thumbFile = thumbInput.files[0] ? (await normalizeFiles([thumbInput.files[0]]))[0] : null;
    const musicFile = musicInput.files[0] ? (await normalizeFiles([musicInput.files[0]]))[0] : null;

    const patch = { trimStart: Math.max(trimStart, 0), trimEnd: Math.max(trimEnd, 0) };
    if (thumbFile) patch.thumbnail = thumbFile;
    if (musicFile) patch.musicTrack = musicFile;

    updateUpload(id, patch);
  });
}

function updateUpload(id, patch) {
  uploads = uploads.map((u) => (u.id === id ? { ...u, ...patch } : u));
  persistUploadViews();
}

function persistUploadViews() {
  saveJson(UPLOAD_STORE_KEY, uploads);
  renderUploads();
  renderHome();
  renderChannelManager();
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

  if (media.type.startsWith('image/')) storyViewerMedia.innerHTML = `<img src="${media.dataUrl}" alt="story" />`;
  else if (media.type.startsWith('video/')) storyViewerMedia.innerHTML = `<video src="${media.dataUrl}" controls autoplay></video>`;
  else storyViewerMedia.innerHTML = `<p>${fileIcon(media.type)} ${escapeHtml(media.name)}</p>`;
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
      renderChannelManager();
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
