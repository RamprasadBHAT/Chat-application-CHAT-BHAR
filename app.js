const tabs = Array.from(document.querySelectorAll('.bottom-nav button'));
const sections = ['home-tab', 'explore-tab', 'post-tab', 'channels-tab', 'chat-tab'].map((id) => document.getElementById(id));

tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabs.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    sections.forEach((s) => (s.hidden = s.id !== btn.dataset.tab));
  });
});

const CURRENT_USER_ID = 'u-me';
const users = [
  { id: 'u-me', name: 'You' },
  { id: 'u-anaya', name: 'Anaya' },
  { id: 'u-rohit', name: 'Rohit' },
  { id: 'u-sam', name: 'Sam' },
  { id: 'u-neha', name: 'Neha' }
];

const isImageFile = (name = '', type = '') => {
  const lower = name.toLowerCase();
  return type.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.gif'].some((ext) => lower.endsWith(ext));
};

const showFileName = (file) => !isImageFile(file.name, file.type);

const conversations = [
  {
    id: 'dm-u-anaya',
    name: 'Anaya',
    type: 'dm',
    members: ['u-me', 'u-anaya'],
    messages: [
      { id: 'm1', from: 'u-anaya', text: 'Hey! Send the launch poster please.', at: '09:12', attachments: [], deletedFor: [] }
    ]
  },
  {
    id: 'grp-product',
    name: 'Product Team',
    type: 'group',
    members: ['u-me', 'u-anaya', 'u-rohit'],
    messages: [
      { id: 'm2', from: 'u-me', text: 'Welcome team 🚀', at: '08:00', attachments: [], deletedFor: [] }
    ]
  }
];

let activeConversationId = conversations[0].id;
let stagedAttachments = [];
let typingTimeout;

const socketBus = new BroadcastChannel('chatbhar-socket');
const mySocketId = `${Date.now()}-${Math.random()}`;
const socketConnections = new Set([mySocketId]);
const typingMap = new Map();

const conversationList = document.getElementById('conversation-list');
const messagesEl = document.getElementById('messages');
const activeTitle = document.getElementById('active-title');
const presenceLine = document.getElementById('presence-line');
const typingIndicator = document.getElementById('typing-indicator');
const composer = document.getElementById('composer');
const textInput = document.getElementById('text-input');
const attachmentInput = document.getElementById('attachment');

const contactDialog = document.getElementById('contact-dialog');
const groupDialog = document.getElementById('group-dialog');
const imagePreviewDialog = document.getElementById('image-preview-dialog');
const imageViewDialog = document.getElementById('image-view-dialog');

const toTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getUserName = (id) => users.find((u) => u.id === id)?.name || 'Unknown';

const postSocketEvent = (event, payload) => socketBus.postMessage({ event, payload, socketId: mySocketId });

const renderPresence = () => {
  const online = Math.max(socketConnections.size, 1);
  presenceLine.textContent = `Online users: ${online}`;
};

const activeConversation = () => conversations.find((c) => c.id === activeConversationId);

const getMessageById = (conversationId, messageId) => {
  const convo = conversations.find((c) => c.id === conversationId);
  if (!convo) return null;
  return convo.messages.find((m) => m.id === messageId) || null;
};

const isMessageVisibleToCurrentUser = (message) => !message.deletedFor?.includes(CURRENT_USER_ID);

const renderTyping = () => {
  const convo = activeConversation();
  const typingUserId = convo ? typingMap.get(convo.id) : null;
  typingIndicator.textContent = typingUserId ? `${getUserName(typingUserId)} is typing...` : '';
};

const renderConversations = () => {
  conversationList.innerHTML = '';
  conversations.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = `conversation-item ${c.id === activeConversationId ? 'active' : ''}`;
    btn.innerHTML = `<strong>${c.name}</strong><br /><small>${c.type === 'group' ? `Group · ${c.members.length} members` : 'Direct message'}</small>`;
    btn.addEventListener('click', () => {
      activeConversationId = c.id;
      renderConversations();
      renderMessages();
      renderTyping();
    });
    conversationList.appendChild(btn);
  });
};

const consumeViewOnceImage = (messageId) => {
  const convo = activeConversation();
  if (!convo) return;
  const msg = convo.messages.find((m) => m.id === messageId);
  if (!msg) return;
  msg.attachments = msg.attachments.map((a) => {
    if (a.kind === 'image' && a.viewOnce && !a.viewedBy.includes(CURRENT_USER_ID)) {
      return {
        ...a,
        viewedBy: [...a.viewedBy, CURRENT_USER_ID],
        url: ''
      };
    }
    return a;
  });
  renderMessages();
};

const openImage = (attachment, messageId) => {
  if (attachment.viewOnce && attachment.viewedBy.includes(CURRENT_USER_ID)) return;
  document.getElementById('view-image').src = attachment.url;
  imageViewDialog.showModal();
  if (attachment.viewOnce) consumeViewOnceImage(messageId);
};

const renderAttachment = (attachment, messageId) => {
  if (attachment.kind === 'image') {
    if (attachment.viewOnce && attachment.viewedBy.includes(CURRENT_USER_ID)) {
      return `<div class="view-once-placeholder">Photo</div>`;
    }
    const chip = attachment.viewOnce ? '<span class="view-once-chip">View once</span>' : '';
    return `<img class="message-image" src="${attachment.url}" alt="Shared image" data-attachment-id="${attachment.id}" data-message-id="${messageId}" />${chip}`;
  }

  const name = showFileName(attachment) ? attachment.name : '';
  return `<a class="msg-doc" href="${attachment.url}" download="${attachment.name}" target="_blank">📄 ${name || 'Document'}</a>`;
};

const renderMessageActions = (message) => {
  if (message.deletedForEveryone) return '';

  const isOwn = message.from === CURRENT_USER_ID;
  const canEdit = isOwn && Boolean(message.text) && message.attachments.length === 0;
  const editButton = canEdit ? `<button type="button" data-action="edit" data-message-id="${message.id}">Edit</button>` : '';
  const deleteEveryoneButton = isOwn
    ? `<button type="button" data-action="delete-everyone" data-message-id="${message.id}">Delete for Everyone</button>`
    : '';

  return `
    <div class="message-actions">
      ${editButton}
      <button type="button" data-action="delete-self" data-message-id="${message.id}">Delete for Me</button>
      ${deleteEveryoneButton}
    </div>
  `;
};

const renderMessages = () => {
  const convo = activeConversation();
  activeTitle.textContent = convo ? `${convo.name} • ${convo.type === 'group' ? 'Group' : 'DM'}` : 'Select a conversation';
  messagesEl.innerHTML = '';

  convo?.messages
    .filter(isMessageVisibleToCurrentUser)
    .forEach((m) => {
      const card = document.createElement('div');
      card.className = `message ${m.from === CURRENT_USER_ID ? 'self' : ''}`;
      card.dataset.messageId = m.id;

      let body = '<div class="msg-caption">This message was deleted.</div>';
      if (!m.deletedForEveryone) {
        const attachments = m.attachments.map((a) => renderAttachment(a, m.id)).join('');
        const caption = m.text ? `<div class="msg-caption">${m.text}</div>` : '';
        body = `${attachments}${caption}`;
      }

      card.innerHTML = `
        <small>${getUserName(m.from)} • ${m.at}${m.edited ? ' · edited' : ''}</small>
        ${body}
        ${renderMessageActions(m)}
      `;
      messagesEl.appendChild(card);
    });

  messagesEl.querySelectorAll('.message-image').forEach((img) => {
    img.addEventListener('click', () => {
      const convo = activeConversation();
      if (!convo) return;
      const messageId = img.dataset.messageId;
      const msg = convo.messages.find((m) => m.id === messageId);
      const attachment = msg?.attachments.find((a) => a.id === img.dataset.attachmentId);
      if (attachment) openImage(attachment, messageId);
    });
  });

  messagesEl.querySelectorAll('.message-actions button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const convo = activeConversation();
      if (!convo) return;
      const message = getMessageById(convo.id, btn.dataset.messageId);
      if (!message) return;

      const action = btn.dataset.action;

      if (action === 'edit') {
        const updated = prompt('Edit your message', message.text || '');
        if (updated === null) return;
        message.text = updated.trim();
        message.edited = true;
      }

      if (action === 'delete-self') {
        const existing = new Set(message.deletedFor || []);
        existing.add(CURRENT_USER_ID);
        message.deletedFor = Array.from(existing);
      }

      if (action === 'delete-everyone' && message.from === CURRENT_USER_ID) {
        message.text = '';
        message.attachments = [];
        message.deletedForEveryone = true;
      }

      renderMessages();
    });
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const sendTypingEvent = (isTyping) => {
  const convo = activeConversation();
  if (!convo) return;
  postSocketEvent('typing', { conversationId: convo.id, userId: CURRENT_USER_ID, isTyping });
};

textInput.addEventListener('keypress', () => {
  sendTypingEvent(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => sendTypingEvent(false), 900);
});

const fileToPayload = async (file, options = { viewOnce: false }) => {
  const url = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  return {
    id: `${Date.now()}-${Math.random()}`,
    name: file.name,
    type: file.type,
    url,
    kind: isImageFile(file.name, file.type) ? 'image' : 'document',
    viewOnce: Boolean(options.viewOnce && isImageFile(file.name, file.type)),
    viewedBy: []
  };
};

const addMessage = (conversationId, message) => {
  const convo = conversations.find((c) => c.id === conversationId);
  if (!convo) return;
  convo.messages.push({ deletedFor: [], edited: false, deletedForEveryone: false, ...message });
  renderConversations();
  renderMessages();
};

attachmentInput.addEventListener('change', async () => {
  const files = Array.from(attachmentInput.files || []);
  if (!files.length) return;

  const firstImage = files.find((f) => isImageFile(f.name, f.type));
  if (firstImage) {
    stagedAttachments = files;
    document.getElementById('preview-image').src = URL.createObjectURL(firstImage);
    document.getElementById('preview-caption').value = '';
    document.getElementById('preview-view-once').checked = false;
    imagePreviewDialog.showModal();
    return;
  }

  const docs = await Promise.all(files.map((f) => fileToPayload(f)));
  const convo = activeConversation();
  if (!convo) return;
  addMessage(convo.id, { id: `m-${Date.now()}`, from: CURRENT_USER_ID, text: '', at: toTime(), attachments: docs });
  attachmentInput.value = '';
});

composer.addEventListener('submit', async (event) => {
  event.preventDefault();
  const convo = activeConversation();
  if (!convo) return;
  const text = textInput.value.trim();
  if (!text) return;

  addMessage(convo.id, { id: `m-${Date.now()}`, from: CURRENT_USER_ID, text, at: toTime(), attachments: [] });
  textInput.value = '';
  sendTypingEvent(false);

  setTimeout(() => {
    const otherId = convo.members.find((m) => m !== CURRENT_USER_ID);
    if (!otherId) return;
    addMessage(convo.id, {
      id: `m-${Date.now()}-reply`,
      from: otherId,
      text: 'Got it 👍',
      at: toTime(),
      attachments: []
    });
  }, 900);
});

document.getElementById('image-preview-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const convo = activeConversation();
  if (!convo) return;
  const caption = document.getElementById('preview-caption').value.trim();
  const viewOnce = document.getElementById('preview-view-once').checked;

  const attachments = await Promise.all(stagedAttachments.map((f) => fileToPayload(f, { viewOnce })));
  addMessage(convo.id, { id: `m-${Date.now()}`, from: CURRENT_USER_ID, text: caption, at: toTime(), attachments });

  imagePreviewDialog.close();
  stagedAttachments = [];
  attachmentInput.value = '';
  document.getElementById('preview-image').src = '';
});

document.getElementById('cancel-preview').addEventListener('click', () => {
  imagePreviewDialog.close();
  stagedAttachments = [];
  attachmentInput.value = '';
  document.getElementById('preview-image').src = '';
});

document.getElementById('close-image-preview').addEventListener('click', () => imagePreviewDialog.close());
document.getElementById('close-image-view').addEventListener('click', () => imageViewDialog.close());

document.getElementById('select-contact-btn').addEventListener('click', () => {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  users
    .filter((u) => u.id !== CURRENT_USER_ID)
    .forEach((u) => {
      const row = document.createElement('div');
      row.className = 'picker-item';
      row.innerHTML = `<span>${u.name}</span><button type="button">Chat</button>`;
      row.querySelector('button').addEventListener('click', () => {
        const id = `dm-${u.id}`;
        const existing = conversations.find((c) => c.id === id);
        if (!existing) {
          conversations.unshift({ id, name: u.name, type: 'dm', members: [CURRENT_USER_ID, u.id], messages: [] });
        }
        activeConversationId = id;
        renderConversations();
        renderMessages();
        contactDialog.close();
      });
      list.appendChild(row);
    });
  contactDialog.showModal();
});

document.getElementById('create-group-btn').addEventListener('click', () => {
  const members = document.getElementById('group-members');
  members.innerHTML = '';
  users
    .filter((u) => u.id !== CURRENT_USER_ID)
    .forEach((u) => {
      const row = document.createElement('label');
      row.className = 'picker-item';
      row.innerHTML = `<span>${u.name}</span><input type="checkbox" value="${u.id}" />`;
      members.appendChild(row);
    });
  groupDialog.showModal();
});

document.getElementById('group-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('group-name').value.trim();
  if (!name) return;

  const selected = Array.from(document.querySelectorAll('#group-members input:checked')).map((i) => i.value);
  if (!selected.length) return;

  const id = `grp-${Date.now()}`;
  conversations.unshift({
    id,
    name,
    type: 'group',
    members: [CURRENT_USER_ID, ...selected],
    messages: []
  });
  activeConversationId = id;
  document.getElementById('group-name').value = '';
  groupDialog.close();
  renderConversations();
  renderMessages();
});

document.getElementById('close-contact').addEventListener('click', () => contactDialog.close());
document.getElementById('close-group').addEventListener('click', () => groupDialog.close());

socketBus.onmessage = (evt) => {
  const { event, payload, socketId } = evt.data || {};
  if (!event || socketId === mySocketId) return;

  if (event === 'presence:online') {
    socketConnections.add(payload.socketId);
    renderPresence();
  }

  if (event === 'presence:offline') {
    socketConnections.delete(payload.socketId);
    renderPresence();
  }

  if (event === 'typing') {
    if (payload.isTyping) typingMap.set(payload.conversationId, payload.userId);
    else typingMap.delete(payload.conversationId);
    renderTyping();
  }
};

postSocketEvent('presence:online', { socketId: mySocketId, userId: CURRENT_USER_ID });
window.addEventListener('beforeunload', () => {
  postSocketEvent('presence:offline', { socketId: mySocketId, userId: CURRENT_USER_ID });
  socketBus.close();
});

renderConversations();
renderMessages();
renderPresence();
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
let uploads = loadJson(UPLOAD_STORE_KEY, []);
let activeSession = null;
let authUsers = [];
let activeStoryItems = [];
let activeStoryIndex = 0;
let activePostViewerId = null;
let confirmAction = null;

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
  if (!localStorage.getItem(AUTH_RESET_DONE_KEY)) {
    localStorage.removeItem(AUTH_USERS_KEY);
    try { await apiRequest('/api/admin/reset-signups', { method: 'POST' }); } catch {}
    localStorage.setItem(AUTH_RESET_DONE_KEY, '1');
  }
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

async function onSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  if (!name || !email || !password) return setAuthMessage('Please fill all signup fields.', false);
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

async function loadSession() {
  activeSession = loadJson(AUTH_SESSION_KEY, null);
  if (!activeSession?.id) {
    authGate.hidden = false;
    appShell.hidden = true;
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
    const initials = (u.displayName || 'User').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
    const card = document.createElement('div');
    card.className = 'explore-user-card glass';
    card.innerHTML = `
      <div class="explore-user-head">
        <div class="avatar">${escapeHtml(initials || 'U')}</div>
        <div>
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
  renderUploads();
  if (!postViewer.hidden && activePostViewerId === postId) openPostViewer(postId);
}

function renderChannelManager() {
  channelContentList.innerHTML = '';
  if (!activeSession) return;
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
  
  
  
