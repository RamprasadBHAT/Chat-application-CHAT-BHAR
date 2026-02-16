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
      { id: 'm1', from: 'u-anaya', text: 'Hey! Send the launch poster please.', at: '09:12', attachments: [] }
    ]
  },
  {
    id: 'grp-product',
    name: 'Product Team',
    type: 'group',
    members: ['u-me', 'u-anaya', 'u-rohit'],
    messages: [
      { id: 'm2', from: 'u-me', text: 'Welcome team 🚀', at: '08:00', attachments: [] }
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

const renderMessages = () => {
  const convo = activeConversation();
  activeTitle.textContent = convo ? `${convo.name} • ${convo.type === 'group' ? 'Group' : 'DM'}` : 'Select a conversation';
  messagesEl.innerHTML = '';

  convo?.messages.forEach((m) => {
    const card = document.createElement('div');
    card.className = `message ${m.from === CURRENT_USER_ID ? 'self' : ''}`;
    const attachments = m.attachments.map((a) => renderAttachment(a, m.id)).join('');
    const caption = m.text ? `<div class="msg-caption">${m.text}</div>` : '';
    card.innerHTML = `<small>${getUserName(m.from)} • ${m.at}</small>${attachments}${caption}`;
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
  convo.messages.push(message);
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
