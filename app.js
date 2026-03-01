import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

function getDmChatId(uid1, uid2) {
  const ids = [uid1, uid2].sort();
  return `dm:${ids[0]}_${ids[1]}`;
}

const AUTH_USERS_KEY = 'chatbhar.users';
const AUTH_RESET_DONE_KEY = 'chatbhar.authResetDone';
const AUTH_SESSION_KEY = 'chatbhar.session';
const CHAT_STORE_KEY = 'chatbhar.chatStore';
const UPLOAD_STORE_KEY = 'chatbhar.uploads';

let selectedUser = null;

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
const messagesContainer = document.getElementById('messages');
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
const prevPostBtn = document.getElementById('prevPost');
const nextPostBtn = document.getElementById('nextPost');

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

const contactRequestModal = document.getElementById('contactRequestModal');
const closeContactRequestModal = document.getElementById('closeContactRequestModal');
const sendContactRequestBtn = document.getElementById('sendContactRequestBtn');
const cancelContactRequestBtn = document.getElementById('cancelContactRequestBtn');
const contactRequestAvatar = document.getElementById('contactRequestAvatar');
const contactRequestName = document.getElementById('contactRequestName');

const incomingRequestModal = document.getElementById('incomingRequestModal');
const closeIncomingRequestModal = document.getElementById('closeIncomingRequestModal');
const acceptRequestBtn = document.getElementById('acceptRequestBtn');
const declineRequestBtn = document.getElementById('declineRequestBtn');
const incomingRequestName = document.getElementById('incomingRequestName');

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
let activeChat = null;
let messageUnsubscribe = null;
let chatMeta = loadJson('chatbhar.chatMeta', {});

function getUnifiedChatId(id) {
  if (!id) return null;
  if (!id.startsWith('dm:')) return id;

  const content = id.replace('dm:', '');
  let uids;
  if (content.includes('_')) {
    uids = content.split('_');
  } else {
    // Legacy single UID format: dm:OTHER_UID
    const myUid = auth.currentUser?.uid || activeSession?.id;
    if (!myUid) return id;
    uids = [myUid, content];
  }

  uids.sort();
  return `dm:${uids[0]}_${uids[1]}`;
}

let previewPendingMessage = null;
let typingTimeout = null;
let ws = null;
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
let currentPendingRequest = null;
let recentSearches = loadJson('chatbhar.recentSearches', []);
let myRelationships = [];
let myFollows = [];
let myFollowRequests = [];
let incomingFollowRequests = [];
let myConversations = [];

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
  projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
  storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "FIREBASE_APP_ID_PLACEHOLDER",
  measurementId: "FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

initApp();

async function initApp() {
  hydrateState(); // Hydrate immediately for fast feedback

  bindEvents();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDocWithRetry(doc(db, "users", user.uid));
      if (userDoc) {
        const userData = userDoc.data();
        const username = (userData.usernames || []).find(x => x.id === userData.activeUsernameId)?.value || '';
        activeSession = { ...userData, username };
        saveJson(AUTH_SESSION_KEY, activeSession);

        authGate.hidden = true;
        appShell.hidden = false;

        if (!activeSession.username) {
          openOnboarding();
        } else {
          startRealTimeSync();
          renderHome();
          renderChannelManager();
        }
      }
    } else {
      activeSession = null;
      localStorage.removeItem(AUTH_SESSION_KEY);
      authGate.hidden = false;
      appShell.hidden = true;
    }
  });

  await bootstrapUsers();
  migrateOldUploads();
  applyUploadType();

  if (activeSession && activeSession.id) {
      startRealTimeSync();
  }

  renderUploads();
  renderHome();
  renderChannelManager();
  initEnhancedMessaging();
}

function startRealTimeSync() {
    fetchAndSyncPosts();
    fetchAndSyncMessages();
    fetchAndSyncConversations();
    fetchAndSyncContactRequests();
    fetchAndSyncRelationships();
}

async function fetchAndSyncMessages(chatIdArg = null) {
  if (!activeSession || !auth.currentUser || typeof db === 'undefined') return;

  // 1. Target ID Selection and Selected User State
  let targetChatId = chatIdArg ? getUnifiedChatId(chatIdArg) : activeChat;
  if (!targetChatId) return;

  const myUid = auth.currentUser.uid;

  if (targetChatId.startsWith('dm:')) {
    const content = targetChatId.replace('dm:', '');
    const otherUid = content.includes('_') ? content.split('_').find(id => id !== myUid) : content;
    const finalOtherUid = otherUid || myUid;

    // Fix: Ensure 'Selected User' state is being updated correctly
    const u = authUsers.find(x => x.id === finalOtherUid) || { id: finalOtherUid, name: 'User' };
    selectedUser = { ...u, uid: u.id };

    // The ID Generator Fix (Alphabetical sort fix)
    targetChatId = getDmChatId(myUid, selectedUser.uid);

    // Ensure chat metadata is present for the header
    if (!chatMeta[targetChatId]) {
      chatMeta[targetChatId] = {
        id: targetChatId,
        name: selectedUser.username || selectedUser.name || 'User',
        participants: [myUid, selectedUser.uid],
        isGroup: false
      };
      saveJson('chatbhar.chatMeta', chatMeta);
    }
  } else {
    selectedUser = null;
  }

  // Update Global State immediately
  activeChat = targetChatId;
  const currentChatId = activeChat;

  if (messageUnsubscribe) {
    messageUnsubscribe();
    messageUnsubscribe = null;
  }

  // 2. The Message Listener (Look for where your app loads messages)
  // Ensure your query is triggered immediately after chatId generation
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", currentChatId),
    orderBy("createdAt", "asc")
  );

  // Fast Feedback: Render from local store while waiting for snapshot
  renderMessages(chatStore[currentChatId] || []);
  renderChatUsers();

  // 3. The Real-time sync (OnSnapshot)
  messageUnsubscribe = onSnapshot(q, (snapshot) => {
    // Map snapshot to message objects with dir helper
    const snapshotMsgs = snapshot.docs.map(doc => {
      const data = doc.data();
      const dir = data.senderId === myUid ? 'outgoing' : 'incoming';
      return { id: doc.id, ...data, dir, docId: doc.id };
    });

    // Filter "Delete for Me"
    const visible = snapshotMsgs.filter(m => !m.deletedFor || !m.deletedFor.includes(myUid));

    // Sort Chronologically
    visible.sort((a, b) => {
      const getMs = (v) => v?.seconds ? v.seconds * 1000 : (v ? new Date(v).getTime() : 0);
      const ta = getMs(a.createdAt);
      const tb = getMs(b.createdAt);
      return ta - tb;
    });

    // Update the local store (used by sidebar preview)
    chatStore[currentChatId] = visible;
    saveJson(CHAT_STORE_KEY, chatStore);

    // This puts the messages into the big chat box
    if (activeChat === currentChatId) {
      renderMessages(visible);
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        // Scroll again after a short delay to ensure rendering is complete
        setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 100);
      }
    }
  }, (err) => console.error("Firestore Message Sync Error:", err));
}

function fetchAndSyncConversations() {
  if (!activeSession || typeof db === 'undefined' || !auth.currentUser) return;

  onSnapshot(query(collection(db, "conversations"), where("participants", "array-contains", auth.currentUser.uid)), (snapshot) => {
    myConversations = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));

    // Update chatMeta with unified conversation IDs
    myConversations.forEach(conv => {
        const unifiedId = getUnifiedChatId(conv.id);
        if (!chatMeta[unifiedId]) {
             chatMeta[unifiedId] = {
                 id: unifiedId,
                 name: conv.name || (conv.isGroup ? 'Group' : 'User'),
                 participants: conv.participants,
                 isGroup: conv.isGroup,
                 online: false
             };
        }
    });

    renderChatUsers();

    if (!activeChat && myConversations.length > 0) {
      const sorted = [...myConversations].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      fetchAndSyncMessages(sorted[0].id);
    }
  });
}

function fetchAndSyncRelationships() {
    if (!activeSession || typeof db === 'undefined') return;

    const updateCombined = () => {
        myRelationships = [
            ...myFollows.map(f => ({ ...f, status: 'accepted' })),
            ...myFollowRequests.map(r => ({ ...r, status: 'pending' }))
        ];
        renderExploreUsers(exploreSearchInput.value);
    };

    onSnapshot(query(collection(db, "follows"), where("followerId", "==", activeSession.id)), (snapshot) => {
        myFollows = snapshot.docs.map(d => d.data());
        updateCombined();
    });

    onSnapshot(query(collection(db, "followRequests"), where("followerId", "==", activeSession.id)), (snapshot) => {
        myFollowRequests = snapshot.docs.map(d => d.data());
        updateCombined();
    });
}

function fetchAndSyncContactRequests() {
  if (!activeSession || typeof db === 'undefined') return;

  onSnapshot(query(collection(db, "requests"), where("toUid", "==", activeSession.id), where("status", "==", "pending")), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const req = change.doc.data();
        req.id = change.doc.id;
        showIncomingRequest(req);
      }
    });
  });

  fetchAndSyncFollowRequests();
}

function showIncomingRequest(req) {
  currentPendingRequest = req;
  const sender = authUsers.find(u => u.id === req.fromUid);
  incomingRequestName.textContent = sender ? (sender.username || sender.name) : 'Someone';
  incomingRequestModal.hidden = false;
}

async function acceptContactRequest() {
  if (!currentPendingRequest) return;
  try {
    const reqRef = doc(db, "requests", currentPendingRequest.id);
    await updateDoc(reqRef, { status: 'accepted' });

    // Create a follow relationship as well
    const relId = `${currentPendingRequest.fromUid}_${activeSession.id}`;
    await setDoc(doc(db, "relationships", relId), {
      id: relId,
      followerId: currentPendingRequest.fromUid,
      followingId: activeSession.id,
      status: 'accepted',
      createdAt: Date.now()
    });

    incomingRequestModal.hidden = true;
    currentPendingRequest = null;
    alert('Request accepted!');
  } catch (err) {
    alert('Error accepting request: ' + err.message);
  }
}

async function declineContactRequest() {
  if (!currentPendingRequest) return;
  try {
    const reqRef = doc(db, "requests", currentPendingRequest.id);
    await updateDoc(reqRef, { status: 'declined' });
    incomingRequestModal.hidden = true;
    currentPendingRequest = null;
  } catch (err) {
    alert('Error declining request: ' + err.message);
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

async function getDocWithRetry(docRef, maxRetries = 5, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap;
    if (i < maxRetries - 1) await new Promise(r => setTimeout(r, delay));
  }
  return null;
}



async function syncAuthUsers() {
  if (typeof db === 'undefined') return;
  onSnapshot(collection(db, "users"), (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });
    authUsers = users;
    saveJson(AUTH_USERS_KEY, authUsers);
    renderExploreUsers();
  });
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
  navButtons.forEach((btn) => {
    if (btn.dataset.tab === 'channels') {
      let timer;
      btn.addEventListener('mousedown', () => {
        timer = setTimeout(() => {
          openTab('channels');
          // Special view for long press
          document.getElementById('analyticsTabBtn').click();
          timer = null;
        }, 800);
      });
      btn.addEventListener('mouseup', () => {
        if (timer) {
          clearTimeout(timer);
          openTab('channels');
        }
      });
      btn.addEventListener('touchstart', (e) => {
        timer = setTimeout(() => {
          openTab('channels');
          document.getElementById('analyticsTabBtn').click();
          timer = null;
        }, 800);
      }, { passive: true });
      btn.addEventListener('touchend', () => {
        if (timer) {
          clearTimeout(timer);
          openTab('channels');
        }
      });
    } else {
      btn.addEventListener('click', () => openTab(btn.dataset.tab));
    }
  });
  exploreSearchInput.addEventListener('input', () => {
    const val = exploreSearchInput.value;
    renderExploreUsers(val);
    if (val.trim()) {
      updateRecentSearches(val.trim());
    }
  });
  renderRecentSearches();

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

  const settingsBtn = document.querySelector('.settings-btn');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      deleteAccountModal.hidden = false;
      deleteConfirmPassword.value = '';
      deleteTick.checked = false;
      confirmDeleteBtn.disabled = true;

      if (deleteTick) {
        deleteTick.onchange = () => {
          confirmDeleteBtn.disabled = !deleteTick.checked;
        };
      }
    };
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

  if (closeContactRequestModal) closeContactRequestModal.onclick = () => contactRequestModal.hidden = true;
  if (cancelContactRequestBtn) cancelContactRequestBtn.onclick = () => contactRequestModal.hidden = true;
  if (sendContactRequestBtn) sendContactRequestBtn.onclick = sendContactRequest;

  if (closeIncomingRequestModal) closeIncomingRequestModal.onclick = () => incomingRequestModal.hidden = true;
  if (acceptRequestBtn) acceptRequestBtn.onclick = acceptContactRequest;
  if (declineRequestBtn) declineRequestBtn.onclick = declineContactRequest;

  const chatThemeToggle = document.getElementById('chatThemeToggle');
  if (chatThemeToggle) {
    chatThemeToggle.onclick = () => {
      const chatLayout = document.querySelector('.chat-layout');
      chatLayout.classList.toggle('chat-dark');
    };
  }

  const contextEditBtn = document.getElementById('contextEditBtn');
  if (contextEditBtn) {
    contextEditBtn.onclick = () => {
      const editMsgModal = document.getElementById('editMsgModal');
      const editMsgInput = document.getElementById('editMsgInput');
      editMsgInput.value = currentContextMsg.text || '';
      editMsgModal.hidden = false;
      document.getElementById('msgContextMenu').hidden = true;
    };
  }

  const closeEditMsg = document.getElementById('closeEditMsg');
  if (closeEditMsg) closeEditMsg.onclick = () => (document.getElementById('editMsgModal').hidden = true);

  const saveEditMsgBtn = document.getElementById('saveEditMsgBtn');
  if (saveEditMsgBtn) {
    saveEditMsgBtn.onclick = async () => {
      const newText = document.getElementById('editMsgInput').value.trim();
      if (newText && currentContextMsg && currentContextMsg.docId) {
        try {
          await updateDoc(doc(db, "messages", currentContextMsg.docId), { text: newText, edited: true });
          document.getElementById('editMsgModal').hidden = true;
        } catch (err) {
          alert("Failed to edit message: " + err.message);
        }
      }
    };
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

  if (prevPostBtn) prevPostBtn.onclick = () => navigatePostViewer(-1);
  if (nextPostBtn) nextPostBtn.onclick = () => navigatePostViewer(1);

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
          const exists = authUsers.some(u => (u.usernames || []).some(x => x.value.toLowerCase() === val && u.id !== activeSession.id));
          if (exists) throw new Error('Username already taken');

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
    const followingUser = authUsers.find(u => u.id === followingId);
    if (!followingUser) throw new Error("User not found");

    const relId = `${activeSession.id}_${followingId}`;

    if (followingUser.isPrivate) {
      await setDoc(doc(db, "followRequests", relId), {
        id: relId,
        followerId: activeSession.id,
        followingId,
        createdAt: Date.now()
      });
      alert('Follow request sent');
    } else {
      await setDoc(doc(db, "follows", relId), {
        id: relId,
        followerId: activeSession.id,
        followingId,
        createdAt: Date.now()
      });

      // Update stats
      const myRef = doc(db, "users", activeSession.id);
      await updateDoc(myRef, { "stats.following": (activeSession.stats?.following || 0) + 1 });
      const theirRef = doc(db, "users", followingId);
      await updateDoc(theirRef, { "stats.followers": (followingUser.stats?.followers || 0) + 1 });
    }

    await renderExploreUsers(exploreSearchInput.value);
  } catch (err) {
    alert(err.message);
  }
}

async function unfollowUser(followingId) {
  if (!activeSession) return;
  try {
    const relId = `${activeSession.id}_${followingId}`;
    const followDoc = await getDoc(doc(db, "follows", relId));

    if (followDoc.exists()) {
      await deleteDoc(doc(db, "follows", relId));
      const followingUser = authUsers.find(u => u.id === followingId);
      const myRef = doc(db, "users", activeSession.id);
      await updateDoc(myRef, { "stats.following": Math.max(0, (activeSession.stats?.following || 0) - 1) });
      const theirRef = doc(db, "users", followingId);
      await updateDoc(theirRef, { "stats.followers": Math.max(0, (followingUser?.stats?.followers || 0) - 1) });
    } else {
      // Maybe it was a pending request
      await deleteDoc(doc(db, "followRequests", relId));
    }

    await renderExploreUsers(exploreSearchInput.value);
  } catch (err) {
    alert(err.message);
  }
}

let contactRequestUserId = null;

async function openContactRequestModal(userId) {
  contactRequestUserId = userId;
  const user = authUsers.find(u => u.id === userId);
  if (!user) return;

  contactRequestName.textContent = user.username || user.name;
  renderProfileAvatar(contactRequestAvatar, user);

  // Check if request already exists
  const q = query(collection(db, "requests"), where("fromUid", "==", activeSession.id), where("toUid", "==", userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const req = snap.docs[0].data();
    document.getElementById('contactRequestStatus').textContent = `Request Status: ${req.status}`;
    sendContactRequestBtn.disabled = true;
  } else {
    document.getElementById('contactRequestStatus').textContent = `You need to be contacts to message this user.`;
    sendContactRequestBtn.disabled = false;
  }

  contactRequestModal.hidden = false;
}

async function sendContactRequest() {
  if (!activeSession || !contactRequestUserId) return;
  try {
    const reqId = `${activeSession.id}_${contactRequestUserId}`;
    await setDoc(doc(db, "requests", reqId), {
      fromUid: activeSession.id,
      toUid: contactRequestUserId,
      status: 'pending',
      createdAt: Date.now()
    });
    alert('Contact request sent!');
    contactRequestModal.hidden = true;
  } catch (err) {
    alert('Error sending request: ' + err.message);
  }
}

async function isMutualFollow(userId1, userId2) {
    try {
        const q1 = query(collection(db, "follows"), where("followerId", "==", userId1), where("followingId", "==", userId2));
        const q2 = query(collection(db, "follows"), where("followerId", "==", userId2), where("followingId", "==", userId1));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        return !snap1.empty && !snap2.empty;
    } catch (err) {
        console.error("Error checking mutual follow:", err);
        return false;
    }
}

async function onExploreMessageClick(userId, username) {
  if (!auth.currentUser) return;

  const mutual = await isMutualFollow(auth.currentUser.uid, userId);
  if (!mutual) {
      alert("You can only message users if you follow each other.");
      return;
  }

  // Explicitly set selectedUser
  selectedUser = authUsers.find(u => u.id === userId) || { id: userId, uid: userId, name: username };
  if (!selectedUser.uid) selectedUser.uid = selectedUser.id;

  // Generate exact chatId
  const currentChatId = getDmChatId(auth.currentUser.uid, selectedUser.uid);

  if (!chatMeta[currentChatId]) {
    chatMeta[currentChatId] = {
      id: currentChatId,
      name: username,
      participants: [auth.currentUser.uid, selectedUser.uid],
      isGroup: false,
      online: true
    };
    saveJson('chatbhar.chatMeta', chatMeta);
  }

  // Ensure conversation doc exists
  try {
    const convRef = doc(db, "conversations", currentChatId);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, {
        id: currentChatId,
        participants: [auth.currentUser.uid, selectedUser.uid],
        isGroup: false,
        name: "", // Will use user names for DMs
        lastMessage: "Start of conversation",
        updatedAt: Date.now()
      });
    }
  } catch (err) {
    console.error("Failed to create/check conversation doc:", err);
  }

  const navBtn = document.querySelector('.nav-btn[data-tab="chat"]');
  if (navBtn) navBtn.click();
  renderChatUsers();
  fetchAndSyncMessages(currentChatId);
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
      const relId = `${activeSession.id}_${userId}`;
      const followDoc = await getDoc(doc(db, "follows", relId));
      if (followDoc.exists()) {
        relStatus = 'accepted';
      } else {
        const reqDoc = await getDoc(doc(db, "followRequests", relId));
        if (reqDoc.exists()) relStatus = 'pending';
      }
    } catch (err) {
      console.error(err);
    }
  }

  const isFollowing = relStatus === 'accepted';

  // Populate Header
  myChannelHandle.textContent = user.username || user.name || 'User';
  myChannelDisplayName.textContent = user.name || user.username;

  const canSeeDetails = !user.isPrivate || isFollowing;

  myChannelProfession.textContent = canSeeDetails ? (user.profession || 'Content Creator') : '';
  myChannelBio.textContent = canSeeDetails ? (user.bio || '') : 'Follow to see bio';

  if (myChannelLocation) {
    if (canSeeDetails && user.location) {
      myChannelLocation.hidden = false;
      myChannelLocation.querySelector('span').textContent = user.location;
    } else {
      myChannelLocation.hidden = true;
    }
  }

  if (myChannelSocialLinks) {
    myChannelSocialLinks.innerHTML = '';
    if (canSeeDetails) {
      const links = user.socialLinks || {};
      if (links.twitter) myChannelSocialLinks.innerHTML += `<a href="${links.twitter}" target="_blank">🐦 Twitter</a>`;
      if (links.linkedin) myChannelSocialLinks.innerHTML += `<a href="${links.linkedin}" target="_blank">🔗 LinkedIn</a>`;
      if (links.github) myChannelSocialLinks.innerHTML += `<a href="${links.github}" target="_blank">💻 GitHub</a>`;
    }
  }

  myPostCount.textContent = user.stats?.posts || 0;

  // Requirement: hide names of followers/following lists (we already just show counts)
  // Requirement: public accounts hide names from lists? Handled by showing only counts here.
  myFollowerCount.textContent = isFollowing || !user.isPrivate ? (user.stats?.followers || 0) : "?";
  myFollowingCount.textContent = isFollowing || !user.isPrivate ? (user.stats?.following || 0) : "?";

  myFollowerCount.parentElement.style.cursor = 'pointer';
  myFollowerCount.parentElement.onclick = () => openUserListModal(userId, 'followers');
  myFollowingCount.parentElement.style.cursor = 'pointer';
  myFollowingCount.parentElement.onclick = () => openUserListModal(userId, 'following');

  renderProfileAvatar(myChannelAvatar, user);

  // Buttons for other profile
  const usernameRow = document.querySelector('.profile-username-row');
  const editBtn = usernameRow.querySelector('.edit-profile-btn');
  const settingsBtn = usernameRow.querySelector('.settings-btn');

  // Clear existing extra buttons
  const existingBtns = usernameRow.querySelectorAll('.dynamic-btn');
  existingBtns.forEach(b => b.remove());

  if (activeSession && userId !== activeSession.id) {
    editBtn.hidden = true;
    settingsBtn.hidden = true;

    const followBtn = document.createElement('button');
    followBtn.className = 'follow-btn dynamic-btn';
    if (!relStatus) {
      followBtn.textContent = 'Follow';
      followBtn.onclick = () => followUser(userId);
    } else if (relStatus === 'pending') {
      followBtn.textContent = 'Requested';
      followBtn.disabled = true;
      followBtn.classList.add('requested');
    } else {
      followBtn.textContent = 'Unfollow';
      followBtn.classList.add('following');
      followBtn.onclick = () => unfollowUser(userId);
    }
    usernameRow.appendChild(followBtn);

    if (!user.isPrivate || isFollowing) {
      const msgBtn = document.createElement('button');
      msgBtn.className = 'message-btn dynamic-btn';
      msgBtn.textContent = 'Message';
      msgBtn.onclick = () => onExploreMessageClick(userId, user.username || user.name);
      usernameRow.appendChild(msgBtn);

      // Mutual follow check for Message button visibility
      isMutualFollow(activeSession.id, userId).then(mutual => {
          if (!mutual) msgBtn.remove();
      });
    }
  } else {
    editBtn.hidden = false;
    settingsBtn.hidden = false;
  }

  // Private account check
  const canSeeContent = !user.isPrivate || isFollowing;

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
    const reqRef = doc(db, "followRequests", relationshipId);
    const reqDoc = await getDoc(reqRef);
    if (!reqDoc.exists()) throw new Error("Request not found");

    const relData = reqDoc.data();

    // Create follow document
    await setDoc(doc(db, "follows", relationshipId), {
      ...relData,
      createdAt: Date.now()
    });

    // Delete request document
    await deleteDoc(reqRef);

    const followerRef = doc(db, "users", relData.followerId);
    const followingRef = doc(db, "users", relData.followingId);

    const followerDoc = await getDoc(followerRef);
    const followingDoc = await getDoc(followingRef);

    if (followerDoc.exists()) {
      await updateDoc(followerRef, { "stats.following": (followerDoc.data().stats?.following || 0) + 1 });
    }
    if (followingDoc.exists()) {
      await updateDoc(followingRef, { "stats.followers": (followingDoc.data().stats?.followers || 0) + 1 });
    }

    await renderExploreUsers(exploreSearchInput.value);
    renderChannelManager();
    renderFollowRequests();
  } catch (err) {
    alert(err.message);
  }
}

async function declineFollowRequest(relationshipId) {
  try {
    await deleteDoc(doc(db, "followRequests", relationshipId));
    renderFollowRequests();
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
  let profilePic = activeSession.profilePic;

  try {
    if (activeSession.pendingProfilePic) {
      // Upload new profile pic to storage
      const res = await uploadToBackend(dataURLtoFile(activeSession.pendingProfilePic, "profile.jpg"));
      profilePic = res.dataUrl;
    }

    const updates = {
      name,
      bio,
      profession,
      location,
      socialLinks: { twitter, linkedin, github },
      profilePic,
      isPrivate
    };

    // Handle username change if needed
    if (username && username !== activeSession.username) {
      const exists = authUsers.some(u => (u.usernames || []).some(x => x.value.toLowerCase() === username.toLowerCase() && u.id !== activeSession.id));
      if (exists) throw new Error('Username already taken');

      const usernames = activeSession.usernames || [];
      const currentIdx = usernames.findIndex(x => x.id === activeSession.activeUsernameId);
      if (currentIdx !== -1) {
        usernames[currentIdx].value = username;
        usernames[currentIdx].updatedAt = Date.now();
      } else {
        const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        usernames.push({ id, value: username, createdAt: Date.now(), updatedAt: Date.now() });
        updates.activeUsernameId = id;
      }
      updates.usernames = usernames;
      activeSession.username = username;
    }

    await updateDoc(doc(db, "users", activeSession.id), updates);

    activeSession = { ...activeSession, ...updates };
    delete activeSession.pendingProfilePic;
    saveJson(AUTH_SESSION_KEY, activeSession);

    editProfileModal.hidden = true;
    renderChannelManager();
    await renderExploreUsers();
  } catch (err) {
    alert(err.message);
  }
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      id: user.uid,
      name,
      email,
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

    await setDoc(doc(db, "users", user.uid), userData);

    activeSession = { ...userData, username: '' };
    saveJson(AUTH_SESSION_KEY, activeSession);
    signupForm.reset();
    await bootstrapUsers(); // Sync users immediately
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

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDocWithRetry(doc(db, "users", user.uid));
    if (!userDoc) throw new Error("User data not found in Firestore.");

    const userData = userDoc.data();
    const username = (userData.usernames || []).find(x => x.id === userData.activeUsernameId)?.value || '';

    activeSession = { ...userData, username };
    saveJson(AUTH_SESSION_KEY, activeSession);
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
    const q = query(collection(db, "users"), where("usernames", "array-contains-any", [{ value: val }]));
    // Wait, usernames is an array of objects. array-contains doesn't work for partial object.
    // I'll fetch all users or use a separate collection for usernames if this was a real app.
    // For now, I'll search through authUsers which is synced.
    const exists = authUsers.some(u => (u.usernames || []).some(x => x.value.toLowerCase() === val));

    if (exists) throw new Error('Username already taken');
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
    const exists = authUsers.some(u => (u.usernames || []).some(x => x.value.toLowerCase() === username.toLowerCase()));
    if (exists) throw new Error('Username already taken');

    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const newName = { id, value: username, createdAt: Date.now(), updatedAt: Date.now() };

    const userRef = doc(db, "users", activeSession.id);
    const usernames = activeSession.usernames || [];
    usernames.push(newName);

    await updateDoc(userRef, {
      usernames: usernames,
      activeUsernameId: id
    });

    activeSession.usernames = usernames;
    activeSession.activeUsernameId = id;
    activeSession.username = username;
    saveJson(AUTH_SESSION_KEY, activeSession);

    usernameForm.hidden = true;
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

function updateRecentSearches(query) {
  const users = authUsers.filter(u => (u.username || u.name)?.toLowerCase().includes(query.toLowerCase()));
  if (users.length > 0) {
    const user = users[0];
    const item = { id: user.id, username: user.username || user.name };
    recentSearches = recentSearches.filter(s => s.id !== item.id);
    recentSearches.unshift(item);
    recentSearches = recentSearches.slice(0, 5);
    saveJson('chatbhar.recentSearches', recentSearches);
    renderRecentSearches();
  }
}

function renderRecentSearches() {
  const container = document.getElementById('recentSearches');
  if (!container) return;
  container.innerHTML = recentSearches.map(s => `
    <button class="glass" style="padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; cursor: pointer;">${escapeHtml(s.username)}</button>
  `).join('');
  container.querySelectorAll('button').forEach((btn, idx) => {
    btn.onclick = () => {
      exploreSearchInput.value = recentSearches[idx].username;
      renderExploreUsers(recentSearches[idx].username);
    };
  });
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
  if (!activeSession || !auth.currentUser) return;

  try {
    const credential = EmailAuthProvider.credential(activeSession.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);

    const userId = activeSession.id;

    // First: Delete the user's document from the Firestore users collection
    await deleteDoc(doc(db, "users", userId));

    // Second: Delete the user's files/posts from Firebase Storage & Firestore
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const postData = d.data();
      // Delete files from storage if they are firebase storage URLs
      if (postData.files) {
        for (const file of postData.files) {
          if (file.dataUrl && file.dataUrl.includes('firebasestorage.googleapis.com')) {
            try {
              const fileRef = ref(storage, file.dataUrl);
              await deleteObject(fileRef);
            } catch (storageErr) {
              console.warn('Could not delete storage file:', file.dataUrl, storageErr);
            }
          }
        }
      }
      await deleteDoc(doc(db, "posts", d.id));
    }

    // Third: Delete the account from Firebase Authentication
    await deleteUser(auth.currentUser);

    deleteAccountModal.hidden = true;
    onLogout();
  } catch (error) {
    alert(error.message || 'Deletion failed.');
  }
}

function onLogout() {
  signOut(auth).then(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    activeSession = null;
    // loadSession(); // onAuthStateChanged will handle this
  });
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

    const storageRef = ref(storage, `uploads/${activeSession.id}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(new Error('Network error during upload: ' + error.message));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ name: file.name, type: file.type, size: file.size, dataUrl: downloadURL });
      }
    );
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
        const postDoc = {
          ...baseRecord,
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
          createdAt: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          files: [prepared[idx]],
          edits: [edits[idx] || defaultEdit(prepared[idx].name)]
        };
        await addDoc(collection(db, "posts"), postDoc);
      }
    } else {
      const postDoc = {
        ...baseRecord,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        createdAt: Date.now(),
        expiresAt: null,
        files: prepared,
        edits
      };
      await addDoc(collection(db, "posts"), postDoc);
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

  } catch (err) {
    uploadStatus.textContent = 'Upload failed: ' + err.message;
  }
}

async function fetchAndSyncPosts() {
  if (typeof db === 'undefined') return;
  onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc")), (snapshot) => {
    const newPosts = [];
    snapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), docId: doc.id });
    });

    if (JSON.stringify(newPosts) !== JSON.stringify(uploads)) {
      uploads = newPosts;
      saveJson(UPLOAD_STORE_KEY, uploads);
      renderHome();
      renderUploads();
      renderChannelManager();
    }
  });
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


async function renderExploreUsers(searchQuery = '') {
  const users = authUsers;
  const myFollowings = myRelationships;

  const normalizedQuery = String(searchQuery).trim().toLowerCase();
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
      if (auth.currentUser && u.id === auth.currentUser.uid) return false;
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
    // Only show name of followers/following?
    // Wait, the requirement says "hide the names of their followers/following lists" for public accounts.
    // This is handled in the profile view. In explore search, we show users.

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
    // Search must first land on that user's profile - let's make whole card go to profile
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
      if (e.target.tagName === 'BUTTON') return;
      // Requirement: When clicked from search, do NOT redirect to profile. Instead open Contact Request Modal.
      openContactRequestModal(u.id);
    };
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
  return uploads.filter((u) => u.type === 'story' && u.expiresAt && (typeof u.expiresAt === 'number' ? u.expiresAt : new Date(u.expiresAt).getTime()) > now);
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
  const items = uploads.filter((u) => u.type !== 'story').sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
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
    await updateDoc(doc(db, "posts", post.docId), {
      interactions: { ...interactions, likedBy, likes: likedBy.length }
    });
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
    await updateDoc(doc(db, "posts", post.docId), {
      interactions: { ...interactions, comments: [...(interactions.comments || []), newComment] }
    });
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

  const userPosts = uploads.filter(u => u.userId === post.userId && u.type !== 'story').sort((a,b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
  const idx = userPosts.findIndex(p => p.id === postId);

  if (prevPostBtn) prevPostBtn.disabled = idx <= 0;
  if (nextPostBtn) nextPostBtn.disabled = idx === -1 || idx >= userPosts.length - 1;

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
            await deleteDoc(doc(db, "posts", post.docId));
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

function navigatePostViewer(dir) {
  const post = uploads.find(u => u.id === activePostViewerId);
  if (!post) return;
  const userPosts = uploads.filter(u => u.userId === post.userId && u.type !== 'story').sort((a,b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
  const idx = userPosts.findIndex(p => p.id === activePostViewerId);
  const nextIdx = idx + dir;
  if (nextIdx >= 0 && nextIdx < userPosts.length) {
    openPostViewer(userPosts[nextIdx].id);
  }
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

  const settingsBtnInProfile = document.querySelector('.settings-btn');
  if (settingsBtnInProfile) {
    settingsBtnInProfile.onclick = () => {
      deleteAccountModal.hidden = false;
      deleteConfirmPassword.value = '';
      deleteTick.checked = false;
      confirmDeleteBtn.disabled = true;

      if (deleteTick) {
        deleteTick.onchange = () => {
          confirmDeleteBtn.disabled = !deleteTick.checked;
        };
      }
    };
  }

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
  if (myFollowerCount) {
    myFollowerCount.textContent = activeSession.stats?.followers || 0;
    myFollowerCount.parentElement.style.cursor = 'pointer';
    myFollowerCount.parentElement.onclick = () => openUserListModal(activeSession.id, 'followers');
  }
  if (myFollowingCount) {
    myFollowingCount.textContent = activeSession.stats?.following || 0;
    myFollowingCount.parentElement.style.cursor = 'pointer';
    myFollowingCount.parentElement.onclick = () => openUserListModal(activeSession.id, 'following');
  }

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
    const post = uploads.find(u => u.id === id);
    if (!post) return;
    await updateDoc(doc(db, "posts", post.docId), patch);
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

  const onlineCount = authUsers.filter(u => u.online).length;
  const onlineUsersCount = document.getElementById('onlineUsersCount');
  if (onlineUsersCount) onlineUsersCount.textContent = `Online users: ${onlineCount}`;

  chatUsersWrap.innerHTML = '';

  // Sort conversations by updatedAt descending
  const sortedConvs = [...myConversations].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  sortedConvs.forEach((conv) => {
    const chatId = getUnifiedChatId(conv.id);
    const isGroup = conv.isGroup;
    let otherUser = null;
    let chatName = conv.name || "Chat";

    if (!isGroup) {
      const uids = chatId.replace('dm:', '').split('_');
      const otherUid = uids.find(id => id !== activeSession.id) || uids[0];
      otherUser = authUsers.find(u => u.id === otherUid);
      chatName = otherUser ? (otherUser.username || otherUser.name) : "User";
    }

    const latestMsg = chatStore[chatId]?.at(-1) || { text: conv.lastMessage || 'No messages yet' };
    const btn = document.createElement('button');
    btn.className = `chat-user ${getUnifiedChatId(chatId) === getUnifiedChatId(activeChat) ? 'active' : ''}`;

    // We don't have real-time presence for all users here yet, so default to offline/white
    const status = (otherUser && otherUser.online) ? '🟢' : '⚪';
    const preview = latestMsg.text || (latestMsg.files?.length ? '📎 Attachment' : 'No messages yet');

    let avatarHtml = '';
    if (otherUser?.profilePic) {
      avatarHtml = `<img src="${otherUser.profilePic}" class="chat-avatar" />`;
    } else {
      avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(chatName[0]||'U').toUpperCase()}</div>`;
    }

    btn.innerHTML = `
      ${avatarHtml}
      <div style="flex:1; text-align:left; overflow:hidden">
        <div style="display:flex; justify-content:space-between">
          <span>${status} ${escapeHtml(chatName)}</span>
        </div>
        <small style="display:block; white-space:nowrap; text-overflow:ellipsis; overflow:hidden">${escapeHtml(preview)}</small>
      </div>
    `;

    const avatarEl = btn.querySelector('.chat-avatar');
    if (avatarEl && otherUser) {
      avatarEl.style.cursor = 'pointer';

      let avatarLongPress;
      const triggerProfile = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        openOtherProfile(otherUser.id);
      };

      avatarEl.onmousedown = (e) => {
        if (e.button === 2) return;
        avatarLongPress = setTimeout(() => triggerProfile(e), 600);
      };
      avatarEl.onmouseup = () => clearTimeout(avatarLongPress);
      avatarEl.onmouseleave = () => clearTimeout(avatarLongPress);
      avatarEl.oncontextmenu = (e) => triggerProfile(e);

      avatarEl.ontouchstart = (e) => {
        avatarLongPress = setTimeout(() => triggerProfile(e), 600);
      };
      avatarEl.ontouchend = () => clearTimeout(avatarLongPress);
    }

    btn.addEventListener('click', () => {
      renderChatUsers();
      fetchAndSyncMessages(chatId);
    });
    chatUsersWrap.appendChild(btn);
  });
}

function renderMessages(msgsArg = null) {
  if (!messagesContainer) return;
  if (!activeChat) {
    messagesContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--muted);">Select a contact to start chatting</div>';
    if (activeChatTitle) activeChatTitle.textContent = 'Chat';
    return;
  }

  const msgs = msgsArg || chatStore[activeChat] || [];
  const myUid = auth.currentUser?.uid;

  const meta = chatMeta[activeChat] || { name: activeChat, online: false };
  activeChatTitle.textContent = meta.name;
  if (typingIndicator && !typingIndicator.textContent) typingIndicator.textContent = meta.online ? 'online' : 'offline';

  messagesContainer.innerHTML = '';
  msgs.forEach((msg, idx) => {
    const bubble = document.createElement('div');
    const isImageOnly = !msg.text && !msg.replyToId && (msg.files || []).length > 0 && msg.files.every(f => (f.type || '').startsWith('image/'));
    const dir = msg.dir || (msg.senderId === myUid ? 'outgoing' : 'incoming');
    bubble.className = `bubble ${dir} ${isImageOnly ? 'image-only' : ''}`;

    if (msg.deleted) {
      bubble.innerHTML = '<i style="opacity: 0.7;">This message was deleted</i>';
      bubble.classList.add('deleted-placeholder');
      bubble.dataset.id = msg.id;
      messagesContainer.appendChild(bubble);
      return;
    }

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
      const original = msgs.find(m => m.createdAt === msg.replyToId);
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

    const editedHtml = msg.edited ? '<small style="opacity:0.6; margin-left:4px">(edited)</small>' : '';
    bubble.innerHTML = `${replyHtml}${escapeHtml(msg.text || '')}${editedHtml}${fileHtml}${reactionHtml}`;
    bubble.dataset.id = msg.id;

    bubble.onclick = (e) => showContextMenu(e, bubble);
    bubble.oncontextmenu = (e) => showContextMenu(e, bubble);

    messagesContainer.appendChild(bubble);
  });

  messagesContainer.querySelectorAll('[data-open-img]').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-open-img'));
      openImageFromMessage(idx, msgs);
    });
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function openImageFromMessage(idx, msgsSource = null) {
  const msgs = msgsSource || chatStore[activeChat];
  const msg = msgs[idx];
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
  if (!activeSession || !activeChat || !auth.currentUser) return;

  // Ensure EXACT same chatId format as generator
  let unifiedChatId = activeChat;
  if (selectedUser) {
    unifiedChatId = getDmChatId(auth.currentUser.uid, selectedUser.uid);
  }

  // Create conversation doc if it doesn't exist
  const convRef = doc(db, "conversations", unifiedChatId);
  const convSnap = await getDoc(convRef);
  if (!convSnap.exists()) {
    const isGroup = unifiedChatId.startsWith('group:');
    let participants = [];
    if (!isGroup) {
      const uids = unifiedChatId.replace('dm:', '').split('_');
      participants = uids;
    } else {
      participants = [activeSession.id];
    }
    await setDoc(convRef, {
      id: unifiedChatId,
      participants,
      isGroup,
      name: isGroup ? unifiedChatId.replace('group:', '').split('-')[0] : "",
      lastMessage: "Conversation initialized",
      updatedAt: Date.now()
    });
  }

  const payload = prepared || {
    text: messageInput.value.trim(),
    files: pendingFiles,
    viewOnce: Boolean(viewOnceToggle?.checked),
    replyToId: replyToMsg ? replyToMsg.createdAt : null
  };

  const now = Date.now();
  if (!payload.text && !(payload.files || []).length) return;

  try {
    const msg = {
      chatId: unifiedChatId,
      senderId: auth.currentUser.uid,
      senderName: activeHandle(),
      text: payload.text || '',
      files: payload.files || [],
      replyToId: payload.replyToId || null,
      viewOnce: payload.viewOnce || false,
      createdAt: now,
      participants: selectedUser ? [auth.currentUser.uid, selectedUser.uid] : (chatMeta[unifiedChatId]?.participants || []),
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    };

    await addDoc(collection(db, "messages"), msg);

    // Update conversation record
    await updateDoc(convRef, {
      lastMessage: payload.text || (payload.files?.length ? '📎 Attachment' : ''),
      updatedAt: now
    });

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
}


function bindMessagingUI() {
  if (selectContactBtn) selectContactBtn.addEventListener('click', openContactModal);
  if (createGroupBtn) createGroupBtn.addEventListener('click', openGroupModal);
  if (closeContactModal) closeContactModal.addEventListener('click', () => (contactModal.hidden = true));
  if (closeGroupModal) closeGroupModal.addEventListener('click', () => (groupModal.hidden = true));
  if (createGroupConfirm) createGroupConfirm.addEventListener('click', createGroupChat);

  const msgContextMenu = document.getElementById('msgContextMenu');
  if (messagesContainer && msgContextMenu) {
    let longPressTimer;
    let touchX, touchY;
    messagesContainer.addEventListener('touchstart', (e) => {
      const bubble = e.target.closest('.bubble');
      if (!bubble) return;
      touchStartX = e.touches[0].clientX;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      swipeBubble = bubble;
      longPressTimer = setTimeout(() => showContextMenu({ clientX: touchX, clientY: touchY }, bubble), 600);
    }, { passive: true });

    messagesContainer.addEventListener('touchmove', (e) => {
      clearTimeout(longPressTimer);
      if (!swipeBubble) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      if (deltaX > 0 && deltaX < 80) {
        swipeBubble.style.transform = `translateX(${deltaX}px)`;
      }
    }, { passive: true });

    messagesContainer.addEventListener('touchend', (e) => {
      clearTimeout(longPressTimer);
      if (!swipeBubble) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      swipeBubble.style.transform = '';
      if (deltaX > 50) {
        const bubbleList = Array.from(messagesContainer.querySelectorAll('.bubble'));
        const msgIdx = bubbleList.indexOf(swipeBubble);
        const msg = chatStore[activeChat][msgIdx];
        if (msg) prepareReply(msg);
      }
      swipeBubble = null;
    });

    messagesContainer.addEventListener('contextmenu', (e) => {
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
        if (currentContextMsg && activeSession && currentContextMsg.docId) {
          try {
            const msgRef = doc(db, "messages", currentContextMsg.docId);
            const msgDoc = await getDoc(msgRef);
            if (msgDoc.exists()) {
              const msgData = msgDoc.data();
              const reactions = msgData.reactions || [];
              const idx = reactions.findIndex(r => r.userId === activeSession.id);
              if (idx !== -1) {
                reactions[idx].emoji = emoji;
              } else {
                reactions.push({ userId: activeSession.id, emoji });
              }
              await updateDoc(msgRef, { reactions });
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
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const msgContextMenu = document.getElementById('msgContextMenu');
  if (!msgContextMenu) return;

  const bubbleList = Array.from(messagesContainer.querySelectorAll('.bubble'));
  const msgIdx = bubbleList.indexOf(bubble);
  currentContextMsg = chatStore[activeChat][msgIdx];
  if (!currentContextMsg) return;

  if (currentContextMsg.deleted) return;

  msgContextMenu.hidden = false;

  const x = (e && e.touches && e.touches[0]) ? e.touches[0].clientX : (e ? e.clientX : 100);
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
  const contextEditBtn = document.getElementById('contextEditBtn');
  const isOutgoing = currentContextMsg.dir === 'outgoing';
  const ageInMinutes = (Date.now() - (currentContextMsg.createdAt || 0)) / 1000 / 60;

  if (deleteEveryoneBtn) {
    deleteEveryoneBtn.hidden = !isOutgoing || ageInMinutes > 15;
  }
  if (contextEditBtn) {
    contextEditBtn.hidden = !isOutgoing || ageInMinutes > 15 || !!currentContextMsg.files?.length;
  }
}

async function deleteMessage(type) {
  if (!currentContextMsg || !activeSession) return;

  if (type === 'everyone') {
    try {
      if (currentContextMsg.docId) {
        await updateDoc(doc(db, "messages", currentContextMsg.docId), { deleted: true, text: '', files: [] });
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
      return;
    }
  } else {
    // Delete for me - persistent via Firestore
    try {
      if (currentContextMsg.docId) {
        const deletedFor = currentContextMsg.deletedFor || [];
        if (!deletedFor.includes(activeSession.id)) {
          deletedFor.push(activeSession.id);
          await updateDoc(doc(db, "messages", currentContextMsg.docId), { deletedFor });
        }
      }
    } catch (err) {
      alert('Delete for Me failed: ' + err.message);
      return;
    }
  }

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
  myConversations.forEach((conv) => {
    const chatId = getUnifiedChatId(conv.id);
    if (!chatMeta[chatId]) {
      let chatName = conv.name || "Chat";
      let participants = conv.participants || [];
      const isGroup = conv.isGroup;

      if (!isGroup) {
        const uids = chatId.replace('dm:', '').split('_');
        const myUid = auth.currentUser?.uid || activeSession?.id;
        const otherUid = uids.find(id => id !== myUid) || uids[0];
        const otherUser = authUsers.find(u => u.id === otherUid);
        chatName = otherUser ? (otherUser.username || otherUser.name) : "User";
        participants = [myUid, otherUid];
      }

      chatMeta[chatId] = {
        id: chatId,
        name: chatName,
        participants: participants,
        isGroup: isGroup,
        online: false
      };
    }
  });
  saveJson('chatbhar.chatMeta', chatMeta);
}

async function openContactModal() {
  const modalTitle = document.querySelector('#contactModal h3');
  if (modalTitle) modalTitle.textContent = 'Select Contact';
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
      avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(u.name?.[0]||u.username?.[0]||'U').toUpperCase()}</div>`;
    }

    row.innerHTML = `
      ${avatarHtml}
      <div style="display:flex; flex-direction:column">
          <span>${escapeHtml(u.username || u.name)}</span>
          <small id="mutual-status-${u.id}" style="color:var(--muted)">Checking...</small>
      </div>
      <div style="margin-left:auto; display:flex; gap:4px">
          <button type="button" class="edit-profile-btn view-p-btn">Profile</button>
          <button type="button" class="edit-profile-btn chat-p-btn" hidden>Chat</button>
      </div>
    `;

    isMutualFollow(activeSession.id, u.id).then(mutual => {
        const statusEl = row.querySelector(`#mutual-status-${u.id}`);
        const chatBtn = row.querySelector('.chat-p-btn');
        if (statusEl) statusEl.textContent = mutual ? 'Mutual Follow' : 'Not Mutual';
        if (mutual && chatBtn) chatBtn.hidden = false;
    });

    row.querySelector('.view-p-btn').addEventListener('click', () => {
      contactModal.hidden = true;
      openOtherProfile(u.id);
    });
    row.querySelector('.chat-p-btn').addEventListener('click', () => {
      contactModal.hidden = true;
      onExploreMessageClick(u.id, u.username || u.name);
    });
    contactList.appendChild(row);
  });
  contactModal.hidden = false;
}

async function openUserListModal(userId, type) {
  const user = authUsers.find(u => u.id === userId);
  if (!user) return;

  const isMine = activeSession && userId === activeSession.id;
  const isFollowing = myFollows.some(f => f.followingId === userId);

  if (!isMine && user.isPrivate && !isFollowing) {
      alert("This account is private. Follow to see their followers and following.");
      return;
  }

  const title = type === 'followers' ? 'Followers' : 'Following';
  const modalTitle = document.querySelector('#contactModal h3');
  if (modalTitle) modalTitle.textContent = title;

  contactList.innerHTML = '<div style="text-align:center; padding:20px;">Loading...</div>';
  contactModal.hidden = false;

  try {
    const q = query(collection(db, "follows"), where(type === 'followers' ? "followingId" : "followerId", "==", userId));
    const snap = await getDocs(q);
    const uids = snap.docs.map(d => d.data()[type === 'followers' ? 'followerId' : 'followingId']);

    // For mutual check, we only want to show if we are mutual follows if the req was for mutual check
    // but the task says ensure mutual follows to message.

    if (uids.length === 0) {
        contactList.innerHTML = '<div style="text-align:center; padding:20px;">No users found.</div>';
        return;
    }

    const listUsers = authUsers.filter(u => uids.includes(u.id));
    contactList.innerHTML = '';
    listUsers.forEach(u => {
        const row = document.createElement('div');
        row.className = 'contact-item';

        let avatarHtml = '';
        if (u.profilePic) {
          avatarHtml = `<img src="${u.profilePic}" class="chat-avatar" />`;
        } else {
          avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(u.username?.[0]||u.name?.[0]||'U').toUpperCase()}</div>`;
        }

        row.innerHTML = `
          ${avatarHtml}
          <span>${escapeHtml(u.username || u.name)}</span>
          <button type="button" class="edit-profile-btn" style="margin-left:auto">View Profile</button>
        `;
        row.querySelector('button').onclick = () => {
          contactModal.hidden = true;
          openOtherProfile(u.id);
        };
        contactList.appendChild(row);
    });
  } catch (err) {
    contactList.innerHTML = `<div style="text-align:center; padding:20px; color:red;">Error: ${err.message}</div>`;
  }
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

async function createGroupChat() {
  const name = groupNameInput.value.trim();
  if (!name) return;
  const members = [...groupContactList.querySelectorAll('input:checked')].map((x) => x.value);
  if (!members.length) return;
  const id = `group:${name}-${Date.now()}`;
  const participants = [activeSession.id, ...members];

  try {
    await setDoc(doc(db, "conversations", id), {
      id,
      name,
      participants,
      isGroup: true,
      lastMessage: "Group created",
      updatedAt: Date.now()
    });
  } catch (err) {
    console.error("Failed to create group conversation:", err);
  }

  activeChat = id;
  groupNameInput.value = '';
  groupModal.hidden = true;
  renderChatUsers();
  fetchAndSyncMessages();
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
    isMutualFollow(activeSession.id, user.id).then(mutual => {
      if (!mutual) return;

      const div = document.createElement('div');
      div.className = 'contact-item';

      let avatarHtml = '';
      if (user.profilePic) {
        avatarHtml = `<img src="${user.profilePic}" class="chat-avatar" />`;
      } else {
        avatarHtml = `<div class="chat-avatar" style="background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:12px">${(user.username?.[0]||user.name?.[0]||'U').toUpperCase()}</div>`;
      }

      div.innerHTML = `
        ${avatarHtml}
        <div class="contact-name">${user.username || user.name}</div>
        <button class="edit-profile-btn" style="margin-left: auto;">Send</button>
      `;
      div.querySelector('button').onclick = () => {
        sharePostToChat(postId, user.id);
        modal.hidden = true;
      };
      list.appendChild(div);
    });
  });

  modal.hidden = false;
}

async function sharePostToChat(postId, targetUserId) {
  const post = uploads.find(u => u.id === postId);
  if (!post || !activeSession) return;

  const now = Date.now();
  const text = `Check out this post: ${post.caption || 'Untitled'}`;
  const files = [post.files[0]];
  const chatId = getUnifiedChatId(getDmChatId(activeSession.id, targetUserId));

  try {
    await addDoc(collection(db, "messages"), {
      chatId,
      senderId: activeSession.id,
      senderName: activeHandle(),
      text,
      files,
      createdAt: now,
      participants: [activeSession.id, targetUserId],
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    });

    // Ensure conversation doc exists and is updated
    const convRef = doc(db, "conversations", chatId);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
      await setDoc(convRef, {
        id: chatId,
        participants: [activeSession.id, targetUserId],
        isGroup: false,
        name: "",
        lastMessage: text,
        updatedAt: now
      });
    } else {
      await updateDoc(convRef, {
        lastMessage: text,
        updatedAt: now
      });
    }

    if (!post.interactions.shares) post.interactions.shares = 0;
    const shares = post.interactions.shares + 1;
    await updateDoc(doc(db, "posts", post.docId), { "interactions.shares": shares });

    alert('Post shared successfully!');
  } catch (err) {
    alert('Share failed: ' + err.message);
  }
}

function fetchAndSyncFollowRequests() {
  if (!activeSession || !followRequestsSection || !followRequestsList || typeof db === 'undefined') return;

  onSnapshot(query(collection(db, "followRequests"), where("followingId", "==", activeSession.id)), (snapshot) => {
    incomingFollowRequests = [];
    snapshot.forEach((d) => {
      const rel = d.data();
      const follower = authUsers.find(u => u.id === rel.followerId);
      incomingFollowRequests.push({
        ...rel,
        followerName: follower ? (follower.name || (follower.usernames || []).find(x => x.id === follower.activeUsernameId)?.value) : 'Unknown',
        followerHandle: follower ? (follower.usernames || []).find(x => x.id === follower.activeUsernameId)?.value : ''
      });
    });

    renderFollowRequests();
  });
}

function renderFollowRequests() {
    const requests = incomingFollowRequests;
    if (requests.length > 0) {
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
          <div style="display:flex; gap:4px">
            <button class="accept-btn" style="padding: 4px 8px; font-size: 0.75rem;">Accept</button>
            <button class="decline-btn" style="padding: 4px 8px; font-size: 0.75rem; background: var(--muted);">Decline</button>
          </div>
        `;
        div.querySelector('.accept-btn').onclick = () => acceptFollowRequest(req.id);
        div.querySelector('.decline-btn').onclick = () => declineFollowRequest(req.id);
        followRequestsList.appendChild(div);
      });
    } else {
      followRequestsSection.hidden = true;
    }
}


