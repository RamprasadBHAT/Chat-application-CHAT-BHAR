const AUTH_USERS_KEY = 'chatbhar.users';
const AUTH_RESET_DONE_KEY = 'chatbhar.authResetDone';
const AUTH_SESSION_KEY = 'chatbhar.session';
const CHAT_STORE_KEY = 'chatbhar.chatStore';
const UPLOAD_STORE_KEY = 'chatbhar.uploads';

const authGate = document.getElementById('authGate');
const appShell = document.getElementById('appShell');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const usernameForm = document.getElementById('usernameForm');
const usernameInput = document.getElementById('usernameInput');
const usernameHint = document.getElementById('usernameHint');
const usernameCheckBtn = document.getElementById('usernameCheckBtn');
const authMessage = document.getElementById('authMessage');

const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const deleteAccountOpenBtn = document.getElementById('deleteAccountOpenBtn');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteConfirmPassword = document.getElementById('deleteConfirmPassword');
const deleteTick = document.getElementById('deleteTick');
const deactivateInstead = document.getElementById('deactivateInstead');

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
const myChannelAvatar = document.getElementById('myChannelAvatar');
const myChannelHandle = document.getElementById('myChannelHandle');
const myChannelDisplayName = document.getElementById('myChannelDisplayName');
const myChannelProfession = document.getElementById('myChannelProfession');
const myChannelBio = document.getElementById('myChannelBio');
const myChannelLocation = document.getElementById('myChannelLocation');
const myChannelSocialLinks = document.getElementById('myChannelSocialLinks');
const myPostCount = document.getElementById('myPostCount');
const myFollowerCount = document.getElementById('myFollowerCount');
const myFollowingCount = document.getElementById('myFollowingCount');
const channelContentGrid = document.getElementById('channelContentGrid');
const profileTabs = document.querySelectorAll('.profile-tab');
const editProfileOpenBtn = document.querySelector('.edit-profile-btn');
const editProfileModal = document.getElementById('editProfileModal');
const closeEditProfile = document.getElementById('closeEditProfile');
const cancelEditProfile = document.getElementById('cancelEditProfile');
const editProfileForm = document.getElementById('editProfileForm');
const profilePicInput = document.getElementById('profilePicInput');
const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
const editProfileAvatarPreview = document.getElementById('editProfileAvatarPreview');
const editProfileUsername = document.getElementById('editProfileUsername');
const editProfileName = document.getElementById('editProfileName');
const editProfileProfession = document.getElementById('editProfileProfession');
const editProfileBio = document.getElementById('editProfileBio');
const editProfileLocation = document.getElementById('editProfileLocation');
const editProfileTwitter = document.getElementById('editProfileTwitter');
const editProfileLinkedin = document.getElementById('editProfileLinkedin');
const editProfileGithub = document.getElementById('editProfileGithub');
const editProfilePrivate = document.getElementById('editProfilePrivate');
const usernameAvailabilityHint = document.getElementById('usernameAvailabilityHint');

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

const followRequestsSection = document.getElementById('followRequestsSection');
const followRequestsList = document.getElementById('followRequestsList');

const typeRules = {
  short: { accept: 'video/*', multiple: false, hint: 'Shorts: choose 1 short-form video.', captionRequired: true, descriptionRequired: false },
  carousel: { accept: 'image/*', multiple: true, hint: 'Carousel: choose multiple images.', captionRequired: true, descriptionRequired: false },
  ltv: { accept: 'video/*', multiple: false, hint: 'LTV: choose 1 long-form video.', captionRequired: true, descriptionRequired: true },
  story: { accept: 'image/*,video/*', multiple: true, hint: 'Story: one or many image/video files (24h).', captionRequired: false, descriptionRequired: false }
};

let selectedUploadType = 'short';
let activeProfileTab = 'posts';
let selectedUploadRawFiles = [];
let selectedUploadEdits = [];
let activeSuiteIndex = 0;
let pendingFiles = [];
let chatStore = loadJson(CHAT_STORE_KEY, {});
let activeChat = Object.keys(chatStore)[0] || null;
let chatMeta = loadJson('chatbhar.chatMeta', {});
let previewPendingMessage = null;
let typingTimeout = null;
const presenceBus = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('chatbhar-presence') : null;
let uploads = loadJson(UPLOAD_STORE_KEY, []);
let activeSession = null;
let authUsers = [];
let activeStoryItems = [];
let activeStoryIndex = 0;
let activePostViewerId = null;
let confirmAction = null;
let currentContextMsg = null;
let replyToMsg = null;
let touchStartX = 0;
let swipeBubble = null;

initApp();

async function initApp() {
  bindEvents();
  hydrateState(); // Hydrate immediately for fast feedback
  await fetchAndSyncPosts();
  await bootstrapUsers();
  await loadSession();
  migrateOldUploads();
  applyUploadType();
  await fetchAndSyncMessages();
  renderChatUsers();
  renderMessages();
  renderUploads();
  renderHome();
  await renderExploreUsers();
  renderChannelManager();
  renderFollowRequests();
  initEnhancedMessaging();
}

async function fetchAndSyncMessages() {
  if (!activeSession) return;
  try {
    const payload = await apiRequest('/api/messages', {
      headers: { 'x-user-id': activeSession.id }
    });
    const msgs = payload.messages || [];
    const newStore = {};
    let changed = false;

    msgs.forEach(m => {
      if (!newStore[m.chatId]) newStore[m.chatId] = [];
      const dir = m.senderId === activeSession.id ? 'outgoing' : 'incoming';
      newStore[m.chatId].push({ ...m, dir });

      if (!chatMeta[m.chatId]) {
        chatMeta[m.chatId] = {
          id: m.chatId,
          name: m.senderName || 'User',
          participants: m.participants || [],
          isGroup: m.chatId.startsWith('group:'),
          online: false
        };
        changed = true;
      }
    });

    if (JSON.stringify(newStore) !== JSON.stringify(chatStore)) {
      chatStore = newStore;
      changed = true;
    }

    if (changed) {
      saveJson(CHAT_STORE_KEY, chatStore);
      saveJson('chatbhar.chatMeta', chatMeta);
      renderChatUsers();
      renderMessages();
    }
    if (!activeChat && Object.keys(chatStore).length > 0) {
      activeChat = Object.keys(chatStore)[0];
      renderMessages();
    }
  } catch (err) {
    console.error('Sync messages failed', err);
  }
}

function syncState() {
  if (activeSession) {
    saveJson(AUTH_SESSION_KEY, activeSession);
  }
}

function hydrateState() {
  activeSession = loadJson(AUTH_SESSION_KEY, null);
  uploads = loadJson(UPLOAD_STORE_KEY, []);

  // Hydrate authUsers from local cache to allow rendering before sync
  const localUsers = loadJson(AUTH_USERS_KEY, []);
  if (Array.isArray(localUsers)) {
    authUsers = localUsers;
  } else if (localUsers.users) {
    authUsers = localUsers.users;
  }

  if (activeSession && activeSession.username) {
    authGate.hidden = true;
    appShell.hidden = false;
    renderHome();
    renderChannelManager();
  }
}

function loadJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try { return JSON.parse(raw); } catch { return structuredClone(fallback); }
}
function saveJson(key, payload) { localStorage.setItem(key, JSON.stringify(payload)); }


async function apiRequest(path, options = {}) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  };

  let response;
  try {
    response = await fetch(path, requestOptions);
  } catch (error) {
    console.warn(`Network error for ${path}, falling back to local storage:`, error.message);
    return await localApiRequest(path, options);
  }

  if (!response.ok) {
    if (response.status === 405 || response.status === 501) {
      return await localApiRequest(path, options);
    }
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : {};
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? await response.json() : {};
}

async function localApiRequest(path, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  let users = loadJson(AUTH_USERS_KEY, []);
  if (!Array.isArray(users)) {
    users = users.users || [];
  }
  const localPosts = loadJson(UPLOAD_STORE_KEY, []);

  if (path === '/api/auth/users' && method === 'GET') {
    return { users: users.map(u => ({ ...u, password: '' })) };
  }

  if (path === '/api/auth/signup' && method === 'POST') {
    const { email, password, name } = body;
    if (!name || !email || !password) throw new Error('Please fill all signup fields.');
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(String(email || '').toLowerCase())) throw new Error('Signup requires a valid @gmail.com address.');
    if (String(password || '').length < 8) throw new Error('Password must be at least 8 characters.');
    if (users.some(u => u.email === email)) throw new Error('Email already exists');
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
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
    users.push(newUser);
    saveJson(AUTH_USERS_KEY, users);
    return { user: newUser };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email/password');
    const username = (user.usernames || []).find(x => x.id === user.activeUsernameId)?.value || '';
    return { session: { ...user, username, password: '' }, usernames: user.usernames || [] };
  }

  if (path === '/api/usernames/check' && method === 'POST') {
    const { username } = body;
    const exists = users.some(u => (u.usernames || []).some(x => x.value.toLowerCase() === username.toLowerCase()));
    if (exists) throw new Error('Username already taken');
    return { available: true };
  }

  if (path === '/api/usernames' && method === 'POST') {
    const { userId, username } = body;
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const newName = { id, value: username, createdAt: Date.now(), updatedAt: Date.now() };
    user.usernames = user.usernames || [];
    user.usernames.push(newName);
    user.activeUsernameId = id;
    saveJson(AUTH_USERS_KEY, users);
    return { session: { ...user, username, password: '' } };
  }

  if (path === '/api/posts' && method === 'GET') {
    return { posts: localPosts };
  }

  if (path === '/api/posts' && method === 'POST') {
    const newPost = { ...body, id: body.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)), createdAt: new Date().toISOString() };
    localPosts.push(newPost);
    saveJson(UPLOAD_STORE_KEY, localPosts);
    return { post: newPost };
  }

  if (path === '/api/messages' && method === 'GET') {
    // Return empty to avoid wiping chatStore, or better, don't sync if local
    return { messages: [] };
  }

  if (path === '/api/auth/profile' && method === 'PATCH') {
    const { userId } = body;
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...body };
    saveJson(AUTH_USERS_KEY, users);
    return { user: { ...users[idx], password: '' } };
  }

  if (path.startsWith('/api/posts/') && method === 'PATCH') {
    const id = path.split('/').pop();
    const idx = localPosts.findIndex(p => p.id === id);
    if (idx !== -1) {
      localPosts[idx] = { ...localPosts[idx], ...body };
      saveJson(UPLOAD_STORE_KEY, localPosts);
      return { post: localPosts[idx] };
    }
  }

  if (path.startsWith('/api/posts/') && method === 'DELETE') {
    const id = path.split('/').pop();
    const filtered = localPosts.filter(p => p.id !== id);
    saveJson(UPLOAD_STORE_KEY, filtered);
    return { ok: true };
  }

  if (path === '/api/auth/delete-account' && method === 'POST') {
    const { email, password } = body;
    const idx = users.findIndex(u => u.email === email && u.password === password);
    if (idx === -1) throw new Error('Confirmation failed: Incorrect password.');
    users.splice(idx, 1);
    saveJson(AUTH_USERS_KEY, users);
    // Also cleanup posts and relationships if we had them locally
    const myPosts = localPosts.filter(p => p.email === email); // Simplified check
    const remainingPosts = localPosts.filter(p => !myPosts.includes(p));
    saveJson(UPLOAD_STORE_KEY, remainingPosts);
    return { ok: true };
  }

  return { ok: true };
}

async function syncAuthUsers() {
  try {
    const payload = await apiRequest('/api/auth/users');
    authUsers = payload.users || [];
  } catch {
    // Keep using authUsers from hydrateState on sync failure
  }
}

async function bootstrapUsers() {
  await syncAuthUsers();
}

function bindEvents() {
  signupForm.addEventListener('submit', onSignup);
  loginForm.addEventListener('submit', onLogin);
  usernameCheckBtn.addEventListener('click', onCheckUsername);
  usernameForm.addEventListener('submit', onCreateUsername);
  logoutBtn.addEventListener('click', onLogout);
  themeToggle.addEventListener('click', toggleTheme);
  navButtons.forEach((btn) => btn.addEventListener('click', () => openTab(btn.dataset.tab)));
  exploreSearchInput.addEventListener('input', () => renderExploreUsers(exploreSearchInput.value));

  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });

  const showLoginFormBtn = document.getElementById('showLoginForm');
  const showSignupFormBtn = document.getElementById('showSignupForm');
  if (showLoginFormBtn) {
    showLoginFormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.hidden = true;
      loginForm.hidden = false;
      setAuthMessage('', false);
    });
  }
  if (showSignupFormBtn) {
    showSignupFormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.hidden = true;
      signupForm.hidden = false;
      setAuthMessage('', false);
    });
  }

  if (deleteAccountOpenBtn) {
    deleteAccountOpenBtn.addEventListener('click', () => {
      deleteAccountModal.hidden = false;
      deleteConfirmPassword.value = '';
      deleteTick.checked = false;
      confirmDeleteBtn.disabled = true;
    });
  }
  if (closeDeleteModal) closeDeleteModal.addEventListener('click', () => deleteAccountModal.hidden = true);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteAccountModal.hidden = true);
  if (deactivateInstead) {
    deactivateInstead.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Deactivation is not yet available, but you can simply log out to stop receiving notifications.');
      deleteAccountModal.hidden = true;
    });
  }
  if (deleteTick) {
    deleteTick.addEventListener('change', () => {
      confirmDeleteBtn.disabled = !deleteTick.checked;
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', onDeleteAccount);
  }

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

  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeProfileTab = tab.dataset.profileTab;
      profileTabs.forEach(t => t.classList.toggle('active', t === tab));

      if (channelContentGrid) channelContentGrid.hidden = (activeProfileTab === 'analytics');
      const analyticsSection = document.getElementById('analyticsSection');
      if (analyticsSection) analyticsSection.hidden = (activeProfileTab !== 'analytics');

      renderChannelManager();
    });
  });

  const closeShareModal = document.getElementById('closeShareModal');
  const cancelShareBtn = document.getElementById('cancelShareBtn');
  const shareModal = document.getElementById('shareModal');
  if (closeShareModal) closeShareModal.onclick = () => shareModal.hidden = true;
  if (cancelShareBtn) cancelShareBtn.onclick = () => shareModal.hidden = true;

  if (editProfileOpenBtn) {
    editProfileOpenBtn.addEventListener('click', () => {
      editProfileUsername.value = activeSession.username || '';
      editProfileName.value = activeSession.name || '';
      editProfileProfession.value = activeSession.profession || '';
      editProfileBio.value = activeSession.bio || 'Digital Creator | Tech Enthusiast | Travel Lover 🌍';
      editProfileLocation.value = activeSession.location || '';
      editProfileTwitter.value = activeSession.socialLinks?.twitter || '';
      editProfileLinkedin.value = activeSession.socialLinks?.linkedin || '';
      editProfileGithub.value = activeSession.socialLinks?.github || '';
      editProfilePrivate.checked = !!activeSession.isPrivate;
      usernameAvailabilityHint.textContent = '';
      renderProfileAvatar(editProfileAvatarPreview, activeSession);
      editProfileModal.hidden = false;
    });
  }
  if (closeEditProfile) closeEditProfile.addEventListener('click', () => editProfileModal.hidden = true);
  if (cancelEditProfile) cancelEditProfile.addEventListener('click', () => editProfileModal.hidden = true);
  if (changeProfilePicBtn) changeProfilePicBtn.addEventListener('click', () => profilePicInput.click());
  if (profilePicInput) {
    profilePicInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          activeSession.pendingProfilePic = re.target.result;
          renderProfileAvatar(editProfileAvatarPreview, { ...activeSession, profilePic: re.target.result });
        };
        reader.readAsDataURL(file);
      }
    });
  }
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', onSaveProfile);
  }

  if (editProfileUsername) {
    let timeout;
    editProfileUsername.addEventListener('input', () => {
      clearTimeout(timeout);
      const val = editProfileUsername.value.trim().toLowerCase();
      if (!val || val === activeSession?.username?.toLowerCase()) {
        usernameAvailabilityHint.textContent = '';
        return;
      }
      timeout = setTimeout(async () => {
        try {
          await apiRequest('/api/usernames/check', { method: 'POST', body: JSON.stringify({ username: val }) });
          usernameAvailabilityHint.textContent = 'Username available';
          usernameAvailabilityHint.style.color = '#0f8a3a';
        } catch (e) {
          usernameAvailabilityHint.textContent = e.message;
          usernameAvailabilityHint.style.color = '#d14343';
        }
      }, 500);
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === CHAT_STORE_KEY) {
      chatStore = loadJson(CHAT_STORE_KEY, { General: [] });
      renderChatUsers();
      renderMessages();
    }
    if (e.key === UPLOAD_STORE_KEY) {
      uploads = loadJson(UPLOAD_STORE_KEY, []);
      renderHome();
      renderChannelManager();
    }
  });
}

function renderProfileAvatar(el, user) {
  if (!el) return;
  if (user?.profilePic) {
    el.innerHTML = `<img src="${user.profilePic}" alt="avatar" />`;
  } else {
    const name = user?.name || user?.username || 'U';
    el.textContent = (name[0] || 'U').toUpperCase();
  }
}

async function followUser(followingId) {
  if (!activeSession) return;
  try {
    await apiRequest('/api/relationships/follow', {
      method: 'POST',
      body: JSON.stringify({ followerId: activeSession.id, followingId })
    });
    await renderExploreUsers(exploreSearchInput.value);
  } catch (err) {
    alert(err.message);
  }
}

async function unfollowUser(followingId) {
  if (!activeSession) return;
  try {
    await apiRequest('/api/relationships/unfollow', {
      method: 'POST',
      body: JSON.stringify({ followerId: activeSession.id, followingId })
    });
    await renderExploreUsers(exploreSearchInput.value);
  } catch (err) {
    alert(err.message);
  }
}

async function onExploreMessageClick(userId, username) {
  const chatId = `dm:${userId}`;
  if (!chatMeta[chatId]) {
    chatMeta[chatId] = {
      id: chatId,
      name: username,
      participants: [activeSession.id, userId],
      isGroup: false,
      online: true
    };
    saveJson('chatbhar.chatMeta', chatMeta);
  }
  activeChat = chatId;
  const navBtn = document.querySelector('.nav-btn[data-tab="chat"]');
  if (navBtn) navBtn.click();
  renderChatUsers();
  renderMessages();
}

let otherProfileUserId = null;

async function openOtherProfile(userId) {
  if (activeSession && userId === activeSession.id) {
    openTab('channels');
    return;
  }
  otherProfileUserId = userId;
  await renderOtherProfile(userId);
  openTab('channels');
  document.getElementById('otherProfileHeader').hidden = false;
  document.getElementById('backFromOtherProfile').onclick = () => {
    openTab('explore');
  };
}

async function renderOtherProfile(userId) {
  await syncAuthUsers();
  const user = authUsers.find(u => u.id === userId);
  if (!user) return;

  let relStatus = null;
  if (activeSession) {
    try {
      const payload = await apiRequest(`/api/relationships/following?userId=${activeSession.id}`);
      const rel = (payload.following || []).find(r => r.followingId === userId);
      relStatus = rel ? rel.status : null;
    } catch (err) {
      console.error(err);
    }
  }

  // Populate Header
  myChannelHandle.textContent = user.username || user.name || 'User';
  myChannelDisplayName.textContent = user.name || user.username;
  myChannelProfession.textContent = user.profession || 'Content Creator';
  myChannelBio.textContent = user.bio || '';

  if (myChannelLocation) {
    if (user.location) {
      myChannelLocation.hidden = false;
      myChannelLocation.querySelector('span').textContent = user.location;
    } else {
      myChannelLocation.hidden = true;
    }
  }

  if (myChannelSocialLinks) {
    myChannelSocialLinks.innerHTML = '';
    const links = user.socialLinks || {};
    if (links.twitter) myChannelSocialLinks.innerHTML += `<a href="${links.twitter}" target="_blank">🐦 Twitter</a>`;
    if (links.linkedin) myChannelSocialLinks.innerHTML += `<a href="${links.linkedin}" target="_blank">🔗 LinkedIn</a>`;
    if (links.github) myChannelSocialLinks.innerHTML += `<a href="${links.github}" target="_blank">💻 GitHub</a>`;
  }

  myPostCount.textContent = user.stats?.posts || 0;
  myFollowerCount.textContent = user.stats?.followers || 0;
  myFollowingCount.textContent = user.stats?.following || 0;

  renderProfileAvatar(myChannelAvatar, user);

  // Private account check
  const canSeeContent = !user.isPrivate || relStatus === 'accepted';

  channelContentGrid.innerHTML = '';
  if (!canSeeContent) {
    channelContentGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🔒</div>
        <p style="font-weight: 600; font-size: 1.2rem;">This Account is Private</p>
        <p style="color: var(--muted);">Follow this account to see their photos and videos.</p>
      </div>
    `;
    return;
  }

  const userPosts = uploads.filter(u => u.userId === userId && u.type !== 'story');
  if (!userPosts.length) {
    channelContentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">No posts yet.</div>`;
  } else {
    userPosts.forEach(item => {
      const firstFile = item.files[0];
      if (!firstFile) return;
      const div = document.createElement('div');
      div.className = 'grid-item';
      let mediaHtml = firstFile.type.startsWith('video/')
        ? `<video src="${cdnUrl(firstFile.dataUrl)}"></video>`
        : `<img src="${cdnUrl(firstFile.dataUrl)}" loading="lazy" />`;

      div.innerHTML = `
        ${mediaHtml}
        <div class="grid-item-overlay">
          <span>❤️ ${item.interactions?.likes || 0}</span>
          <span>💬 ${item.interactions?.comments?.length || 0}</span>
        </div>
      `;
      div.addEventListener('click', () => openPostViewer(item.id));
      channelContentGrid.appendChild(div);
    });
  }
}

async function acceptFollowRequest(relationshipId) {
  try {
    await apiRequest('/api/relationships/accept', {
      method: 'POST',
      body: JSON.stringify({ relationshipId })
    });
    renderFollowRequests(); // Need to implement this
    await renderExploreUsers(exploreSearchInput.value);
    renderChannelManager();
  } catch (err) {
    alert(err.message);
  }
}

async function onSaveProfile(e) {
  e.preventDefault();
  const username = editProfileUsername.value.trim();
  const name = editProfileName.value.trim();
  const profession = editProfileProfession.value.trim();
  const bio = editProfileBio.value.trim();
  const location = editProfileLocation.value.trim();
  const twitter = editProfileTwitter.value.trim();
  const linkedin = editProfileLinkedin.value.trim();
  const github = editProfileGithub.value.trim();
  const isPrivate = editProfilePrivate.checked;
  const profilePic = activeSession.pendingProfilePic || activeSession.profilePic;

  try {
    // 1. Handle username change if needed
    if (username && username !== activeSession.username) {
      if (activeSession.username) {
        const usernameId = activeSession.activeUsernameId;
        if (usernameId) {
          await apiRequest(`/api/usernames/${usernameId}`, {
            method: 'PATCH',
            body: JSON.stringify({ userId: activeSession.id, username })
          });
        }
      } else {
        await apiRequest('/api/usernames', {
          method: 'POST',
          body: JSON.stringify({ userId: activeSession.id, username })
        });
      }
      activeSession.username = username;
    }

    // 2. Update other profile fields
    const payload = await apiRequest('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        userId: activeSession.id,
        name,
        bio,
        profession,
        location,
        socialLinks: { twitter, linkedin, github },
        profilePic,
        isPrivate
      })
    });

    activeSession = { ...activeSession, ...payload.user };
    delete activeSession.pendingProfilePic;
    saveJson(AUTH_SESSION_KEY, activeSession);

    editProfileModal.hidden = true;
    renderChannelManager();
    await renderExploreUsers();
  } catch (err) {
    alert(err.message);
  }
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
  const btn = signupForm.querySelector('button[type="submit"]');
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  if (!name || !email || !password || !confirmPassword) return setAuthMessage('Please fill all signup fields.', false);
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) return setAuthMessage('Signup requires a valid @gmail.com address.', false);
  if (password.length < 8) return setAuthMessage('Password must be at least 8 characters.', false);
  if (password !== confirmPassword) return setAuthMessage('Passwords do not match.', false);

  try {
    btn.disabled = true;
    setAuthMessage('Creating account...', true);
    await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    // Auto-login after signup to proceed to onboarding
    const loginPayload = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    activeSession = loginPayload.session;
    saveJson(AUTH_SESSION_KEY, activeSession);
    signupForm.reset();
    await syncAuthUsers();
    openOnboarding();
  } catch (error) {
    setAuthMessage(error.message, false);
  } finally {
    btn.disabled = false;
  }
}

async function onLogin(event) {
  event.preventDefault();
  const btn = loginForm.querySelector('button[type="submit"]');
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  try {
    btn.disabled = true;
    setAuthMessage('Logging in...', true);
    const payload = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    saveJson(AUTH_SESSION_KEY, payload.session);
    activeSession = payload.session;
    syncState();
    setAuthMessage('', false);
    await loadSession();
    if (activeSession.username) openTab('home');
  } catch (error) {
    setAuthMessage(error.message || 'Invalid email/password.', false);
  } finally {
    btn.disabled = false;
  }
}

function openOnboarding() {
  signupForm.hidden = true;
  loginForm.hidden = true;
  usernameForm.hidden = false;
  setAuthMessage('One more step: pick your unique handle.', true);
}

async function onCheckUsername() {
  const val = usernameInput.value.trim().toLowerCase();
  if (!val) return;
  try {
    await apiRequest('/api/usernames/check', { method: 'POST', body: JSON.stringify({ username: val }) });
    usernameHint.textContent = 'Username available';
    usernameHint.style.color = '#0f8a3a';
  } catch (e) {
    usernameHint.textContent = e.message;
    usernameHint.style.color = '#d14343';
  }
}

async function onCreateUsername(e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) return;
  try {
    const payload = await apiRequest('/api/usernames', {
      method: 'POST',
      body: JSON.stringify({ userId: activeSession.id, username })
    });
    activeSession = payload.session;
    saveJson(AUTH_SESSION_KEY, activeSession);
    usernameForm.hidden = true;
    await loadSession();
    openTab('home');
  } catch (e) {
    usernameHint.textContent = e.message;
    usernameHint.style.color = '#d14343';
  }
}

function setAuthMessage(message, success) {
  authMessage.style.color = success ? '#0f8a3a' : '#d14343';
  authMessage.textContent = message;
}

async function loadSession() {
  activeSession = loadJson(AUTH_SESSION_KEY, null);
  if (activeSession) {
    activeSession.savedPosts = activeSession.savedPosts || [];
    activeSession.taggedUsers = activeSession.taggedUsers || [];
  }
  if (!activeSession?.id) {
    authGate.hidden = false;
    appShell.hidden = true;
    signupForm.hidden = false;
    loginForm.hidden = true;
    usernameForm.hidden = true;
    return;
  }

  if (!activeSession.username) {
    authGate.hidden = false;
    appShell.hidden = true;
    openOnboarding();
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
  // Keep session in sync with DB (name, bio, pfp, stats etc)
  activeSession = {
    ...activeSession,
    name: dbUser.name || activeSession.name,
    username: dbUser.username || activeSession.username,
    profilePic: dbUser.profilePic || activeSession.profilePic,
    bio: dbUser.bio || activeSession.bio,
    profession: dbUser.profession || activeSession.profession,
    location: dbUser.location || activeSession.location,
    socialLinks: dbUser.socialLinks || activeSession.socialLinks,
    stats: dbUser.stats || activeSession.stats,
    isPrivate: dbUser.isPrivate !== undefined ? dbUser.isPrivate : activeSession.isPrivate
  };
  saveJson(AUTH_SESSION_KEY, activeSession);


  authGate.hidden = true;
  appShell.hidden = false;
  renderHome();
  await renderExploreUsers();
  renderUploads();
  renderChannelManager();
  renderFollowRequests();
}

async function onDeleteAccount() {
  const password = deleteConfirmPassword.value;
  if (!password) return alert('Please confirm your password.');
  if (!activeSession) return;

  try {
    await apiRequest('/api/auth/delete-account', {
      method: 'POST',
      body: JSON.stringify({ email: activeSession.email, password })
    });
    deleteAccountModal.hidden = true;
    onLogout();
  } catch (error) {
    alert(error.message || 'Deletion failed.');
  }
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
  if (tabId === 'chat') renderFollowRequests();
  if (tabId === 'channels') {
    document.getElementById('otherProfileHeader').hidden = true;
    renderChannelManager();
  }
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

function uploadToBackend(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!activeSession) return reject(new Error('Not logged in'));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload-media');
    xhr.setRequestHeader('x-filename', file.name);
    xhr.setRequestHeader('x-user-id', activeSession.id);
    xhr.setRequestHeader('content-type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(e.loaded / e.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const payload = JSON.parse(xhr.responseText);
          resolve({ name: file.name, type: file.type, size: file.size, dataUrl: payload.url });
        } catch (e) {
          reject(new Error('Invalid server response'));
        }
      } else {
        reject(new Error('Binary upload failed: ' + xhr.statusText));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
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

  try {
    const prepared = [];
    for (let i = 0; i < files.length; i++) {
      const uploaded = await uploadToBackend(files[i], (fraction) => {
        const overall = (i + fraction) / files.length;
        updateProgress(overall);
      });
      prepared.push(uploaded);
    }

    const edits = structuredClone(selectedUploadEdits);

    const baseRecord = {
      type: selectedUploadType,
      userName: activeHandle(),
      userId: activeSession.id,
      caption,
      description,
      interactions: { likes: 0, likedBy: [], comments: [], shares: 0 }
    };

    if (selectedUploadType === 'story') {
      for (let idx = 0; idx < prepared.length; idx++) {
        await apiRequest('/api/posts', {
          method: 'POST',
          body: JSON.stringify({
            ...baseRecord,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            files: [prepared[idx]],
            edits: [edits[idx] || defaultEdit(prepared[idx].name)]
          })
        });
      }
    } else {
      await apiRequest('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...baseRecord,
          expiresAt: null,
          files: prepared,
          edits
        })
      });
    }

    await fetchAndSyncPosts();
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

    // Announce to other tabs/devices
    if (presenceBus) {
      presenceBus.postMessage({ type: 'post_created', userId: activeSession.id });
    }
  } catch (err) {
    uploadStatus.textContent = 'Upload failed: ' + err.message;
  }
}

async function fetchAndSyncPosts() {
  try {
    const payload = await apiRequest('/api/posts');
    const newPosts = payload.posts || [];

    // Check if anything actually changed before re-rendering
    if (JSON.stringify(newPosts) !== JSON.stringify(uploads)) {
      uploads = newPosts;
      saveJson(UPLOAD_STORE_KEY, uploads);
      renderHome();
      renderUploads();
      renderChannelManager();
    }
  } catch (err) {
    console.error('Failed to sync posts', err);
  }
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
  if (type === 'short' && (files.length < 1 || files.some((f) => !f.type.startsWith('video/')))) return bad('Shorts require at least 1 video.');
  if (type === 'carousel' && files.some((f) => !f.type.startsWith('image/'))) return bad('Carousel requires image files only.');
  if (type === 'ltv' && (files.length < 1 || files.some((f) => !f.type.startsWith('video/')))) return bad('LTV require at least 1 video.');
  if (type === 'ltv' && !description) return bad('LTV requires description.');
  if (type === 'story' && files.some((f) => !f.type.startsWith('image/') && !f.type.startsWith('video/'))) return bad('Story accepts only image/video.');
  return true;
}


async function renderExploreUsers(query = '') {
  await syncAuthUsers();
  const users = authUsers;

  let myFollowings = [];
  if (activeSession) {
    try {
      const payload = await apiRequest(`/api/relationships/following?userId=${activeSession.id}`);
      myFollowings = payload.following || [];
    } catch (err) {
      console.error('Failed to fetch following status', err);
    }
  }

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
      // Requirement: filter exclusively by the username field
      return (u.username || '').toLowerCase().includes(normalizedQuery);
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
    const card = document.createElement('div');
    card.className = 'explore-user-card glass';

    let avatarHtml = '';
    if (u.profilePic) {
      avatarHtml = `<div class="avatar" style="overflow:hidden"><img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover" /></div>`;
    } else {
      const initials = (u.displayName || 'User').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
      avatarHtml = `<div class="avatar">${escapeHtml(initials || 'U')}</div>`;
    }

    const rel = myFollowings.find(r => r.followingId === u.id);
    let followBtnHtml = '';
    let messageBtnHtml = '';
    if (activeSession && u.id !== activeSession.id) {
      if (!rel) {
        followBtnHtml = `<button class="follow-btn" data-user-id="${u.id}">Follow</button>`;
      } else if (rel.status === 'pending') {
        followBtnHtml = `<button class="follow-btn requested" disabled>Requested</button>`;
      } else {
        followBtnHtml = `<button class="follow-btn following" data-user-id="${u.id}">Unfollow</button>`;
        messageBtnHtml = `<button class="message-btn" data-user-id="${u.id}">Message</button>`;
      }
    }

    card.innerHTML = `
      <div class="explore-user-head" style="cursor:pointer">
        ${avatarHtml}
        <div>
          <strong>${escapeHtml(u.displayName || u.name)}</strong>
          <p>${escapeHtml(u.email)}</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px">
        ${messageBtnHtml}
        ${followBtnHtml}
        <span class="status-pill ${u.isActive ? 'active' : 'inactive'}">${u.isActive ? 'Active' : 'Off'}</span>
      </div>
    `;

    card.querySelector('.explore-user-head').addEventListener('click', () => {
      openOtherProfile(u.id);
    });

    const btn = card.querySelector('.follow-btn');
    if (btn && !btn.disabled) {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('following')) {
          unfollowUser(u.id);
        } else {
          followUser(u.id);
        }
      });
    }
    const msgBtn = card.querySelector('.message-btn');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => onExploreMessageClick(u.id, u.displayName));
    }
    exploreUsersList.appendChild(card);
  });
}

function renderUploads() {
  uploadList.innerHTML = '';
  const mine = activeSession ? uploads.filter((u) => u.userId === activeSession.id) : [];
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
    const user = authUsers.find(u => (u.username || u.name) === name);
    const el = document.createElement('div');
    el.className = 'story';

    let avatarHtml = '';
    if (user?.profilePic) {
      avatarHtml = `<div class="avatar" style="overflow:hidden"><img src="${user.profilePic}" style="width:100%;height:100%;object-fit:cover" /></div>`;
    } else {
      const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
      avatarHtml = `<div class="avatar">${escapeHtml(initials || 'U')}</div>`;
    }

    el.innerHTML = `${avatarHtml}<p>${escapeHtml(name)}</p>`;
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

    const user = authUsers.find(u => u.id === item.userId || (u.username === item.userName && !item.userId));
    let avatarHtml = '';
    if (user?.profilePic) {
      avatarHtml = `<img src="${user.profilePic}" class="feed-avatar" />`;
    } else {
      const initials = (item.userName || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
      avatarHtml = `<div class="feed-avatar-initials">${initials}</div>`;
    }

    card.innerHTML = `
      <div class="feed-header" style="cursor:pointer">
        ${avatarHtml}
        <div class="feed-type">${item.type.toUpperCase()} · ${escapeHtml(item.userName)}</div>
      </div>
      ${renderFeedMedia(item)}
      <div class="feed-meta">
        <p><strong>${escapeHtml(item.caption || '(No title)')}</strong></p>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
      ${renderInteractionBlock(item)}
    `;
    card.querySelector('.feed-header').onclick = () => {
      if (item.userId) openOtherProfile(item.userId);
    };
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
  const shares = item.interactions?.shares || 0;
  return `
    <div class="post-interaction" data-post-id="${item.id}">
      <div class="interaction-row">
        <button data-action="like">👍 ${likes}</button>
        <button data-action="share">↗ Share (${shares})</button>
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

async function likePost(postId) {
  const userId = activeSession?.id;
  if (!userId) return;
  const post = uploads.find(u => u.id === postId);
  if (!post) return;

  const interactions = post.interactions || { likes: 0, likedBy: [], comments: [] };
  const liked = (interactions.likedBy || []).includes(userId);
  const likedBy = liked ? interactions.likedBy.filter((id) => id !== userId) : [...(interactions.likedBy || []), userId];

  try {
    await apiRequest(`/api/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        interactions: { ...interactions, likedBy, likes: likedBy.length }
      })
    });
    await fetchAndSyncPosts();
    persistAndRerender(postId);
  } catch (err) {
    console.error('Failed to like post', err);
  }
}

async function addComment(postId, text) {
  const content = String(text || '').trim();
  if (!content || !activeSession) return;
  const post = uploads.find(u => u.id === postId);
  if (!post) return;

  const interactions = post.interactions || { likes: 0, likedBy: [], comments: [] };
  const newComment = { user: activeHandle(), text: content, ts: Date.now() };

  try {
    await apiRequest(`/api/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        interactions: { ...interactions, comments: [...(interactions.comments || []), newComment] }
      })
    });
    await fetchAndSyncPosts();
    persistAndRerender(postId);
  } catch (err) {
    console.error('Failed to add comment', err);
  }
}

async function sharePost(postId) {
  openShareModal(postId);
}

function openPostViewer(postId) {
  activePostViewerId = postId;
  const post = uploads.find((u) => u.id === postId);
  if (!post) return;
  postViewerTitle.textContent = `${post.type.toUpperCase()} · ${post.userName}`;
  postViewerMedia.innerHTML = renderFeedMedia(post);

  const isMine = activeSession && post.userId === activeSession.id;

  if (isMine) {
    postViewerInteraction.innerHTML = `
      <div id="ownerControls" class="channel-actions glass" style="margin-top: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--brand-a);">
        <label style="font-size: 0.8rem; font-weight: 700; color: var(--brand-a);">CONTENT MANAGEMENT</label>
        <input id="editCaption" value="${escapeAttr(post.caption || '')}" placeholder="Title" style="width: 100%;" />
        <textarea id="editDescription" placeholder="Description" style="width: 100%; min-height: 60px;">${escapeHtml(post.description || '')}</textarea>
        <div class="upload-btn-row">
          <button id="openSuiteBtn" style="background: var(--muted);">Creative Suite</button>
          <button id="saveMetadataBtn">Save Changes</button>
          <button id="deletePostBtn" class="danger">Delete Post</button>
        </div>
      </div>
      <div style="margin-top: 16px;">
        ${renderInteractionBlock(post)}
      </div>
    `;

    const saveMetadataBtn = document.getElementById('saveMetadataBtn');
    if (saveMetadataBtn) {
      saveMetadataBtn.onclick = async () => {
        const captionInput = document.getElementById('editCaption');
        const descriptionInput = document.getElementById('editDescription');
        if (!captionInput) return;
        const caption = captionInput.value.trim();
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        try {
          await updateUpload(post.id, { caption, description });
          alert('Metadata saved!');
        } catch (err) {
          alert('Failed to save changes: ' + err.message);
        }
      };
    }

    const openSuiteBtn = document.getElementById('openSuiteBtn');
    if (openSuiteBtn) {
      openSuiteBtn.onclick = async () => {
        try {
          // Check if file is local (Base64) or server-hosted
          selectedUploadRawFiles = await dataFilesToBlobs(post.files);
          selectedUploadEdits = post.edits?.length ? structuredClone(post.edits) : selectedUploadRawFiles.map((f) => defaultEdit(f.name));
          openCreativeSuiteModal();
          saveCreativeSuite.onclick = async () => {
            syncSuiteFields();
            try {
              await updateUpload(post.id, { edits: structuredClone(selectedUploadEdits) });
              creativeSuiteModal.hidden = true;
            } catch (err) {
              alert('Failed to save edits: ' + err.message);
            }
          };
        } catch (err) {
          console.error('Failed to open creative suite', err);
          alert('Error loading media for editing.');
        }
      };
    }

    const deletePostBtn = document.getElementById('deletePostBtn');
    if (deletePostBtn) {
      deletePostBtn.onclick = () => {
        openConfirm('Delete this post permanently?', async () => {
          try {
            await apiRequest(`/api/posts/${post.id}`, { method: 'DELETE' });
            await fetchAndSyncPosts();
            persistAllViews();
            postViewer.hidden = true;
          } catch (err) {
            console.error('Failed to delete post', err);
            alert('Failed to delete: ' + err.message);
          }
        });
      };
    }
  } else {
    postViewerInteraction.innerHTML = renderInteractionBlock(post);
  }

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
  if (!activeSession) return;
  const mine = uploads.filter((u) => u.userId === activeSession.id);

  // Populate Header
  if (myChannelHandle) myChannelHandle.textContent = activeSession.username || activeSession.name || 'User';
  if (myChannelDisplayName) myChannelDisplayName.textContent = activeSession.name || activeHandle();
  if (myChannelProfession) myChannelProfession.textContent = activeSession.profession || 'Content Creator';
  if (myChannelBio) myChannelBio.textContent = activeSession.bio || 'Digital Creator | Tech Enthusiast | Travel Lover 🌍';

  if (myChannelLocation) {
    if (activeSession.location) {
      myChannelLocation.hidden = false;
      myChannelLocation.querySelector('span').textContent = activeSession.location;
    } else {
      myChannelLocation.hidden = true;
    }
  }

  if (myChannelSocialLinks) {
    myChannelSocialLinks.innerHTML = '';
    const links = activeSession.socialLinks || {};
    if (links.twitter) myChannelSocialLinks.innerHTML += `<a href="${links.twitter}" target="_blank" title="Twitter">🐦 Twitter</a>`;
    if (links.linkedin) myChannelSocialLinks.innerHTML += `<a href="${links.linkedin}" target="_blank" title="LinkedIn">🔗 LinkedIn</a>`;
    if (links.github) myChannelSocialLinks.innerHTML += `<a href="${links.github}" target="_blank" title="GitHub">💻 GitHub</a>`;
  }

  if (myPostCount) myPostCount.textContent = activeSession.stats?.posts || mine.length;
  if (myFollowerCount) myFollowerCount.textContent = activeSession.stats?.followers || 0;
  if (myFollowingCount) myFollowingCount.textContent = activeSession.stats?.following || 0;

  renderProfileAvatar(myChannelAvatar, activeSession);

  // Populate Content Grid
  if (!channelContentGrid) return;
  channelContentGrid.innerHTML = '';

  let filtered = mine;
  if (activeProfileTab === 'analytics') {
    renderAnalytics(mine);
    return;
  }

  if (activeProfileTab === 'videos') {
    filtered = mine.filter(u => u.type === 'short' || u.type === 'ltv');
  } else if (activeProfileTab === 'saved') {
    const savedIds = activeSession.savedPosts || [];
    filtered = uploads.filter(u => savedIds.includes(u.id));
  } else if (activeProfileTab === 'tagged') {
    filtered = uploads.filter(u => (u.taggedUsers || []).includes(activeSession.id));
  } else {
    filtered = mine.filter(u => u.type !== 'story');
  }

  if (!filtered.length) {
    channelContentGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--muted);">
      <div style="font-size: 2rem; margin-bottom: 10px;">${activeProfileTab === 'saved' ? '🔖' : (activeProfileTab === 'tagged' ? '👤' : '📷')}</div>
      <p style="font-weight: 600; color: var(--text); font-size: 1.2rem;">No ${activeProfileTab} yet</p>
    </div>`;
  } else {
    filtered.forEach(item => {
      const firstFile = item.files[0];
      if (!firstFile) return;

      const div = document.createElement('div');
      div.className = 'grid-item';

      const isMulti = item.files.length > 1 || item.type === 'carousel';
      const isVideo = firstFile.type.startsWith('video/') || item.type === 'short' || item.type === 'ltv';
      const isPinned = !!item.isPinned;

      const icon = isMulti ? '📁' : (isVideo ? '🎬' : '');
      const likes = item.interactions?.likes || 0;
      const comments = item.interactions?.comments?.length || 0;

      let mediaHtml = '';
      if (firstFile.type.startsWith('video/')) {
        mediaHtml = `<video src="${cdnUrl(firstFile.dataUrl)}"></video>`;
      } else {
        mediaHtml = `<img src="${cdnUrl(firstFile.dataUrl)}" loading="lazy" />`;
      }

      div.innerHTML = `
        ${mediaHtml}
        ${isPinned ? '<span class="pin-icon" style="position:absolute; top:8px; left:8px; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">📌</span>' : ''}
        <span class="type-icon">${icon}</span>
        <div class="grid-item-overlay">
          <span>❤️ ${likes}</span>
          <span>💬 ${comments}</span>
        </div>
      `;

      div.addEventListener('click', () => openPostViewer(item.id));
      channelContentGrid.appendChild(div);
    });
  }
}

function openConfirm(message, action) {
  confirmMessage.textContent = message;
  confirmAction = action;
  confirmModal.hidden = false;
}

async function updateUpload(id, patch) {
  try {
    await apiRequest(`/api/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
    await fetchAndSyncPosts();
    persistAndRerender(id);
  } catch (err) {
    console.error('Failed to update post', err);
    throw err;
  }
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
  if (!chatUsersWrap) return;
  chatUsersWrap.innerHTML = '';
  Object.keys(chatStore).forEach((chatId) => {
    const latest = chatStore[chatId].at(-1);
    const meta = chatMeta[chatId] || { name: chatId, online: false };
    const btn = document.createElement('button');
    btn.className = `chat-user ${chatId === activeChat ? 'active' : ''}`;
    const status = meta.online ? '🟢' : '⚪';
    const preview = latest?.text || latest?.files?.[0]?.name || 'No messages yet';

    const user = authUsers.find(u => u.name === meta.name || u.id === chatId.split(':').pop());
    let avatarHtml = '';
    if (user?.profilePic) {
      avatarHtml = `<img src="${user.profilePic}" class="chat-avatar" />`;
    } else {
      avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(meta.name[0]||'U').toUpperCase()}</div>`;
    }

    btn.innerHTML = `
      ${avatarHtml}
      <div style="flex:1; text-align:left; overflow:hidden">
        <div style="display:flex; justify-content:space-between">
          <span>${status} ${escapeHtml(meta.name)}</span>
        </div>
        <small style="display:block; white-space:nowrap; text-overflow:ellipsis; overflow:hidden">${escapeHtml(preview)}</small>
      </div>
    `;
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
  if (!activeChat) {
    messages.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--muted);">Select a contact to start chatting</div>';
    if (activeChatTitle) activeChatTitle.textContent = 'Chat';
    return;
  }
  if (!chatStore[activeChat]) chatStore[activeChat] = [];
  const meta = chatMeta[activeChat] || { name: activeChat, online: false };
  activeChatTitle.textContent = meta.name;
  if (typingIndicator && !typingIndicator.textContent) typingIndicator.textContent = meta.online ? 'online' : 'offline';

  messages.innerHTML = '';
  chatStore[activeChat].forEach((msg, idx) => {
    const bubble = document.createElement('div');
    const isImageOnly = !msg.text && !msg.replyToId && (msg.files || []).length > 0 && msg.files.every(f => (f.type || '').startsWith('image/'));
    bubble.className = `bubble ${msg.dir} ${isImageOnly ? 'image-only' : ''}`;

    let fileHtml = '';
    (msg.files || []).forEach((f) => {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      const isImage = (f.type || '').startsWith('image/');
      const hideName = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext);

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

    let replyHtml = '';
    if (msg.replyToId) {
      const original = chatStore[activeChat].find(m => m.ts === msg.replyToId);
      if (original) {
        replyHtml = `
          <div class="reply-ref">
            <strong>${original.senderName || (original.dir === 'outgoing' ? 'You' : 'User')}</strong>
            <p>${escapeHtml(original.text || (original.files?.length ? 'Photo' : '...'))}</p>
          </div>
        `;
      }
    }

    let reactionHtml = '';
    if (msg.reactions && msg.reactions.length > 0) {
      const counts = {};
      msg.reactions.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
      reactionHtml = `<div class="bubble-reactions" style="position:absolute; bottom:-12px; right:4px; display:flex; gap:2px; background:var(--card); border:1px solid var(--border); border-radius:10px; padding:2px 4px; font-size:0.7rem; z-index:2">${Object.entries(counts).map(([emoji, count]) => `<span>${emoji}${count > 1 ? count : ''}</span>`).join('')}</div>`;
    }

    bubble.innerHTML = `${replyHtml}${escapeHtml(msg.text || '')}${fileHtml}${reactionHtml}`;
    bubble.dataset.id = msg.id;
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
  if (!activeSession || !activeChat) return;
  const payload = prepared || {
    text: messageInput.value.trim(),
    files: pendingFiles,
    viewOnce: Boolean(viewOnceToggle?.checked),
    replyToId: replyToMsg ? replyToMsg.ts : null
  };
  if (!payload.text && !(payload.files || []).length) return;

  const meta = chatMeta[activeChat];
  if (!meta) return;

  try {
    const res = await apiRequest('/api/messages', {
      method: 'POST',
      headers: { 'x-user-id': activeSession.id },
      body: JSON.stringify({
        chatId: activeChat,
        senderName: activeHandle(),
        text: payload.text,
        files: payload.files,
        replyToId: payload.replyToId,
        viewOnce: payload.viewOnce,
        ts: Date.now(),
        participants: meta.participants
      })
    });

    const msg = res.message;
    if (!chatStore[activeChat]) chatStore[activeChat] = [];
    chatStore[activeChat].push({ ...msg, dir: 'outgoing' });
    saveJson(CHAT_STORE_KEY, chatStore);

    if (presenceBus) {
      meta.participants.forEach(pId => {
        if (pId !== activeSession.id) {
          presenceBus.postMessage({
            type: 'message',
            toId: pId,
            fromId: activeChat,
            senderId: activeSession.id,
            senderName: activeHandle(),
            text: msg.text,
            files: msg.files,
            viewOnce: msg.viewOnce,
            replyToId: msg.replyToId,
            ts: msg.ts,
            id: msg.id
          });
        }
      });
    }
  } catch (err) {
    console.error('Send message failed', err);
    alert('Failed to send message: ' + err.message);
  }
  messageInput.value = '';
  fileInput.value = '';
  pendingFiles = [];
  replyToMsg = null;
  const replyWrap = document.getElementById('replyPreviewWrap');
  if (replyWrap) replyWrap.hidden = true;
  if (viewOnceToggle) viewOnceToggle.checked = false;
  renderAttachmentPreview();
  renderChatUsers();
  renderMessages();
}

function renderAttachmentPreview() {
  if (!attachmentPreview) return;
  if (!pendingFiles.length) {
    attachmentPreview.hidden = true;
    attachmentPreview.innerHTML = '';
    return;
  }
  attachmentPreview.hidden = false;
  attachmentPreview.innerHTML = `<strong>Attachments</strong><ul>${pendingFiles.map((f) => `<li>${escapeHtml(f.name)}</li>`).join('')}</ul>`;
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
  return url;
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
    const url = f.dataUrl.startsWith('data:') ? f.dataUrl : window.location.origin + f.dataUrl;
    const res = await fetch(url);
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

  setInterval(fetchAndSyncMessages, 10000);
  setInterval(fetchAndSyncPosts, 15000);

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
        const chatId = msg.fromId;
        if (!chatMeta[chatId]) {
          chatMeta[chatId] = { id: chatId, name: msg.senderName || 'User', participants: [msg.senderId, activeSession.id], isGroup: chatId.startsWith('group:'), online: true };
          saveJson('chatbhar.chatMeta', chatMeta);
        }
        if (!chatStore[chatId]) chatStore[chatId] = [];
        if (!chatStore[chatId].some(m => m.id === msg.id)) {
          chatStore[chatId].push({
            id: msg.id,
            dir: 'incoming',
            text: msg.text,
            files: msg.files,
            viewOnce: msg.viewOnce,
            viewOnceConsumed: false,
            ts: msg.ts,
            replyToId: msg.replyToId,
            senderName: msg.senderName,
            senderId: msg.senderId
          });
          saveJson(CHAT_STORE_KEY, chatStore);
          if (activeChat === chatId) renderMessages();
          renderChatUsers();
        }
      }
      if (msg.type === 'reaction' && msg.toId === activeSession?.id) {
        fetchAndSyncMessages();
      }
      if (msg.type === 'post_created') {
        fetchAndSyncPosts();
      }
      if (msg.type === 'delete_msg' && msg.toId === activeSession?.id) {
        const chatId = msg.chatId;
        if (chatStore[chatId]) {
          const idx = chatStore[chatId].findIndex(m => m.id === msg.msgId || m.ts === msg.msgTs);
          if (idx !== -1) {
            chatStore[chatId].splice(idx, 1);
            saveJson(CHAT_STORE_KEY, chatStore);
            if (activeChat === chatId) renderMessages();
            renderChatUsers();
          }
        }
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

  const msgContextMenu = document.getElementById('msgContextMenu');
  if (messages && msgContextMenu) {
    let longPressTimer;
    let touchX, touchY;
    messages.addEventListener('touchstart', (e) => {
      const bubble = e.target.closest('.bubble');
      if (!bubble) return;
      touchStartX = e.touches[0].clientX;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      swipeBubble = bubble;
      longPressTimer = setTimeout(() => showContextMenu({ clientX: touchX, clientY: touchY }, bubble), 600);
    }, { passive: true });

    messages.addEventListener('touchmove', (e) => {
      clearTimeout(longPressTimer);
      if (!swipeBubble) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      if (deltaX > 0 && deltaX < 80) {
        swipeBubble.style.transform = `translateX(${deltaX}px)`;
      }
    }, { passive: true });

    messages.addEventListener('touchend', (e) => {
      clearTimeout(longPressTimer);
      if (!swipeBubble) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      swipeBubble.style.transform = '';
      if (deltaX > 50) {
        const bubbleList = Array.from(messages.querySelectorAll('.bubble'));
        const msgIdx = bubbleList.indexOf(swipeBubble);
        const msg = chatStore[activeChat][msgIdx];
        if (msg) prepareReply(msg);
      }
      swipeBubble = null;
    });

    messages.addEventListener('contextmenu', (e) => {
      const bubble = e.target.closest('.bubble');
      if (!bubble) return;
      e.preventDefault();
      showContextMenu(e, bubble);
    });

    document.addEventListener('mousedown', (e) => {
      if (!msgContextMenu.contains(e.target)) msgContextMenu.hidden = true;
    });

    msgContextMenu.querySelectorAll('.emoji-bar button').forEach(btn => {
      btn.onclick = async () => {
        const emoji = btn.dataset.emoji;
        if (currentContextMsg && activeSession) {
          try {
            await apiRequest(`/api/messages/${currentContextMsg.id}/react`, {
              method: 'PATCH',
              headers: { 'x-user-id': activeSession.id },
              body: JSON.stringify({ emoji })
            });
            await fetchAndSyncMessages();
            renderMessages();
            if (presenceBus) {
              const meta = chatMeta[activeChat];
              if (meta) {
                meta.participants.forEach(pId => {
                  if (pId !== activeSession.id) {
                    presenceBus.postMessage({ type: 'reaction', toId: pId });
                  }
                });
              }
            }
          } catch (err) {
            console.error('Reaction failed', err);
          }
        }
        msgContextMenu.hidden = true;
      };
    });

    const deleteMeBtn = document.getElementById('deleteMeBtn');
    if (deleteMeBtn) deleteMeBtn.onclick = () => deleteMessage('me');

    const deleteEveryoneBtn = document.getElementById('deleteEveryoneBtn');
    if (deleteEveryoneBtn) deleteEveryoneBtn.onclick = () => deleteMessage('everyone');

    const contextReplyBtn = document.getElementById('contextReplyBtn');
    if (contextReplyBtn) {
      contextReplyBtn.onclick = () => {
        prepareReply(currentContextMsg);
        msgContextMenu.hidden = true;
      };
    }

    const closeReplyBtn = document.getElementById('closeReplyBtn');
    if (closeReplyBtn) {
      closeReplyBtn.onclick = () => {
        replyToMsg = null;
        document.getElementById('replyPreviewWrap').hidden = true;
      };
    }
  }

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

function showContextMenu(e, bubble) {
  const msgContextMenu = document.getElementById('msgContextMenu');
  if (!msgContextMenu) return;

  const bubbleList = Array.from(messages.querySelectorAll('.bubble'));
  const msgIdx = bubbleList.indexOf(bubble);
  currentContextMsg = chatStore[activeChat][msgIdx];
  if (!currentContextMsg) return;

  msgContextMenu.hidden = false;

  const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

  const menuWidth = 200;
  const menuHeight = 150;

  let left = x;
  let top = y;

  if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth - 10;
  if (top + menuHeight > window.innerHeight) top = window.innerHeight - menuHeight - 10;
  if (left < 10) left = 10;
  if (top < 10) top = 10;

  msgContextMenu.style.left = `${left}px`;
  msgContextMenu.style.top = `${top}px`;

  const deleteEveryoneBtn = document.getElementById('deleteEveryoneBtn');
  if (deleteEveryoneBtn) {
    const isOutgoing = currentContextMsg.dir === 'outgoing';
    const ageInMinutes = (Date.now() - (currentContextMsg.ts || 0)) / 1000 / 60;
    deleteEveryoneBtn.hidden = !isOutgoing || ageInMinutes > 15;
  }
}

async function deleteMessage(type) {
  if (!currentContextMsg || !activeSession) return;
  const msgIdx = chatStore[activeChat].indexOf(currentContextMsg);
  if (msgIdx === -1) return;

  if (type === 'everyone') {
    try {
      await apiRequest(`/api/messages/${currentContextMsg.id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': activeSession.id }
      });

      if (presenceBus) {
        const meta = chatMeta[activeChat];
        if (meta) {
          meta.participants.forEach(pId => {
            if (pId !== activeSession.id) {
              presenceBus.postMessage({
                type: 'delete_msg',
                toId: pId,
                chatId: activeChat,
                senderId: activeSession.id,
                msgTs: currentContextMsg.ts,
                msgId: currentContextMsg.id
              });
            }
          });
        }
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
      return;
    }
  }

  chatStore[activeChat].splice(msgIdx, 1);
  saveJson(CHAT_STORE_KEY, chatStore);
  renderMessages();
  renderChatUsers();
  document.getElementById('msgContextMenu').hidden = true;
  currentContextMsg = null;
}

function prepareReply(msg) {
  replyToMsg = msg;
  const wrap = document.getElementById('replyPreviewWrap');
  const name = document.getElementById('replyUserName');
  const text = document.getElementById('replyText');
  if (wrap && name && text) {
    name.textContent = msg.senderName || (msg.dir === 'outgoing' ? 'You' : 'User');
    text.textContent = msg.text || (msg.files?.length ? 'Photo/File' : '...');
    wrap.hidden = false;
  }
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

async function openContactModal() {
  await syncAuthUsers();
  const users = authUsers.filter((u) => u.id !== activeSession?.id);
  contactList.innerHTML = '';
  users.forEach((u) => {
    const row = document.createElement('div');
    row.className = 'contact-item';

    let avatarHtml = '';
    if (u.profilePic) {
      avatarHtml = `<img src="${u.profilePic}" class="chat-avatar" />`;
    } else {
      avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(u.name[0]||'U').toUpperCase()}</div>`;
    }

    row.innerHTML = `${avatarHtml} <span>${escapeHtml(u.name)}</span><button type="button" class="edit-profile-btn" style="margin-left:auto">Select</button>`;
    row.querySelector('button').addEventListener('click', () => {
      const id = `dm:${u.id}`;
      if (!chatStore[id]) chatStore[id] = [];
      chatMeta[id] = { id, name: u.username || u.name, participants: [u.id, activeSession.id], isGroup: false, online: true };
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

async function openGroupModal() {
  await syncAuthUsers();
  const users = authUsers.filter((u) => u.id !== activeSession?.id);
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

async function migrateOldUploads() {
  if (!activeSession) return;
  let changed = false;
  uploads.forEach(u => {
    if (!u.userId && u.userName === activeHandle()) {
      u.userId = activeSession.id;
      changed = true;
    }
    if (!u.interactions) {
      u.interactions = { likes: 0, likedBy: [], comments: [], shares: 0 };
      changed = true;
    } else if (u.interactions.shares === undefined) {
      u.interactions.shares = 0;
      changed = true;
    }
  });
  if (changed) saveJson(UPLOAD_STORE_KEY, uploads);

  // Push local-only posts to backend
  try {
    const payload = await apiRequest('/api/posts');
    const backendPosts = payload.posts || [];
    const myLocalPosts = uploads.filter(u => u.userId === activeSession.id);
    for (const local of myLocalPosts) {
      if (!backendPosts.some(b => b.id === local.id)) {
        await apiRequest('/api/posts', { method: 'POST', body: JSON.stringify(local) });
      }
    }
  } catch (err) {
    console.warn('Background sync failed', err);
  }
}

function renderAnalytics(mine) {
  channelContentGrid.hidden = true;
  document.getElementById('analyticsSection').hidden = false;

  const totalLikes = mine.reduce((sum, u) => sum + (u.interactions?.likes || 0), 0);
  const totalComments = mine.reduce((sum, u) => sum + (u.interactions?.comments?.length || 0), 0);
  const totalShares = mine.reduce((sum, u) => sum + (u.interactions?.shares || 0), 0);

  const engagement = mine.length ? (((totalLikes + totalComments) / mine.length) * 10).toFixed(1) : 0;
  const reach = (totalLikes * 5) + (totalComments * 10) + (totalShares * 20);

  document.getElementById('statReach').textContent = reach.toLocaleString();
  document.getElementById('statEngagement').textContent = engagement + '%';
  document.getElementById('statShares').textContent = totalShares.toLocaleString();

  const chart = document.getElementById('weeklyChart');
  chart.innerHTML = '';

  const now = new Date();
  const dayBuckets = [];
  for(let i=6; i>=0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dayBuckets.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toISOString().split('T')[0],
      count: 0
    });
  }

  mine.forEach(u => {
    const d = (u.createdAt || '').split('T')[0];
    const bucket = dayBuckets.find(b => b.date === d);
    if(bucket) bucket.count++;
  });

  const max = Math.max(...dayBuckets.map(b => b.count), 1);

  dayBuckets.forEach(bucket => {
    const val = (bucket.count / max) * 100;
    const barWrap = document.createElement('div');
    barWrap.className = 'chart-bar-wrap';
    barWrap.innerHTML = `
      <div class="bar" style="height: ${Math.max(val, 5)}%" data-value="${bucket.count}"></div>
      <span class="bar-label">${bucket.label}</span>
    `;
    chart.appendChild(barWrap);
  });
}

function openShareModal(postId) {
  const modal = document.getElementById('shareModal');
  const list = document.getElementById('shareContactList');
  if (!modal || !list) return;

  list.innerHTML = '';
  const others = authUsers.filter(u => u.id !== activeSession.id);

  others.forEach(user => {
    const div = document.createElement('div');
    div.className = 'contact-item';

    let avatarHtml = '';
    if (user.profilePic) {
      avatarHtml = `<img src="${user.profilePic}" class="chat-avatar" />`;
    } else {
      avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(user.name[0]||'U').toUpperCase()}</div>`;
    }

    div.innerHTML = `
      ${avatarHtml}
      <div class="contact-name">${user.name || user.username}</div>
      <button class="edit-profile-btn" style="margin-left: auto;">Send</button>
    `;
    div.querySelector('button').onclick = () => {
      sharePostToChat(postId, user.id);
      modal.hidden = true;
    };
    list.appendChild(div);
  });

  modal.hidden = false;
}

function sharePostToChat(postId, targetUserId) {
  const post = uploads.find(u => u.id === postId);
  if (!post || !activeSession) return;

  const ts = Date.now();
  const text = `Check out this post: ${post.caption || 'Untitled'}`;
  const files = [post.files[0]];
  const chatId = `dm:${targetUserId}`;

  if (!chatStore[chatId]) chatStore[chatId] = [];
  chatStore[chatId].push({
    dir: 'outgoing',
    text,
    files,
    ts,
    senderName: activeHandle()
  });
  saveJson(CHAT_STORE_KEY, chatStore);

  if (!post.interactions.shares) post.interactions.shares = 0;
  post.interactions.shares++;
  saveJson(UPLOAD_STORE_KEY, uploads);

  if (presenceBus) {
    presenceBus.postMessage({
      type: 'message',
      toId: targetUserId,
      fromId: `dm:${activeSession.id}`,
      senderId: activeSession.id,
      senderName: activeHandle(),
      text,
      files,
      ts
    });
  }
  alert('Post shared successfully!');
  renderChatUsers();
  if (activeChat === chatId) renderMessages();
}

async function renderFollowRequests() {
  if (!activeSession || !followRequestsSection || !followRequestsList) return;
  try {
    const { requests } = await apiRequest(`/api/relationships/requests?userId=${activeSession.id}`);
    if (requests && requests.length > 0) {
      followRequestsSection.hidden = false;
      followRequestsList.innerHTML = '';
      requests.forEach(req => {
        const div = document.createElement('div');
        div.className = 'follow-request-item';
        div.style = 'display:flex; justify-content:space-between; align-items:center; padding: 8px; border-radius: 10px; background: rgba(0,0,0,0.03); margin-bottom: 6px;';
        div.innerHTML = `
          <div style="font-size: 0.85rem;">
            <strong>${escapeHtml(req.followerHandle || req.followerName)}</strong> wants to follow you
          </div>
          <button class="accept-btn" style="padding: 4px 8px; font-size: 0.75rem;">Accept</button>
        `;
        div.querySelector('.accept-btn').onclick = () => acceptFollowRequest(req.id);
        followRequestsList.appendChild(div);
      });
    } else {
      followRequestsSection.hidden = true;
    }
  } catch (err) {
    console.error('Failed to fetch follow requests', err);
  }
}
