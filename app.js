const screens = [...document.querySelectorAll('.screen')];
const navButtons = [...document.querySelectorAll('.nav-btn')];
const quickButtons = [...document.querySelectorAll('.quick-card')];
const chatUsers = [...document.querySelectorAll('.chat-user')];
const activeChatTitle = document.getElementById('activeChatTitle');
const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const attachmentPreview = document.getElementById('attachmentPreview');
const themeToggle = document.getElementById('themeToggle');

let pendingFiles = [];

function openTab(tabId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === tabId);
  });

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabId);
  });
}

[...navButtons, ...quickButtons].forEach((button) => {
  button.addEventListener('click', () => openTab(button.dataset.tab));
});

chatUsers.forEach((userBtn) => {
  userBtn.addEventListener('click', () => {
    chatUsers.forEach((u) => u.classList.remove('active'));
    userBtn.classList.add('active');
    activeChatTitle.textContent = userBtn.dataset.name;
  });
});

function renderAttachmentPreview() {
  if (!pendingFiles.length) {
    attachmentPreview.hidden = true;
    attachmentPreview.innerHTML = '';
    return;
  }

  const rows = pendingFiles
    .map((file) => `<li>${file.name} <small>(${Math.ceil(file.size / 1024)} KB)</small></li>`)
    .join('');

  attachmentPreview.innerHTML = `
    <strong>Attachments (${pendingFiles.length})</strong>
    <ul>${rows}</ul>
  `;
  attachmentPreview.hidden = false;
}

fileInput.addEventListener('change', (event) => {
  pendingFiles = [...event.target.files];
  renderAttachmentPreview();
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text && !pendingFiles.length) return;

  const bubble = document.createElement('div');
  bubble.className = 'bubble outgoing';

  const attachmentText = pendingFiles.length
    ? `<br><small>📎 ${pendingFiles.map((f) => f.name).join(', ')}</small>`
    : '';

  bubble.innerHTML = `${text || 'Sent attachments'}${attachmentText}`;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;

  messageInput.value = '';
  fileInput.value = '';
  pendingFiles = [];
  renderAttachmentPreview();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
