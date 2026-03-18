function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getDmChatId(uid1, uid2) {
  const ids = [uid1, uid2].filter(Boolean).sort();
  return ids.length === 2 ? `dm:${ids[0]}_${ids[1]}` : null;
}

function inferParticipants(chatId, messages, activeUserId) {
  const msgParticipants = messages.flatMap((msg) => Array.isArray(msg?.participants) ? msg.participants : []);
  const senderReceiver = messages.flatMap((msg) => [msg?.senderId, msg?.receiverId].filter(Boolean));
  const unique = [...new Set([...msgParticipants, ...senderReceiver].filter(Boolean))];

  if (chatId?.startsWith('dm:')) {
    const rawIds = chatId.replace('dm:', '').split('_').filter(Boolean);
    const ids = [...new Set([...rawIds, ...unique])];
    if (activeUserId && !ids.includes(activeUserId)) ids.unshift(activeUserId);
    return ids.slice(0, 2).sort();
  }

  if (unique.length) return unique;
  return activeUserId ? [activeUserId] : [];
}

function normalizeChatId(chatId, messages, activeUserId) {
  if (!chatId) return 'General';
  if (!chatId.startsWith('dm:')) return chatId;
  if (chatId.includes('_')) {
    const ids = chatId.replace('dm:', '').split('_').filter(Boolean).sort();
    return ids.length === 2 ? `dm:${ids[0]}_${ids[1]}` : chatId;
  }

  const participants = inferParticipants(chatId, messages, activeUserId);
  if (participants.length >= 2) {
    return getDmChatId(participants[0], participants[1]) || chatId;
  }

  if (activeUserId && chatId !== `dm:${activeUserId}`) {
    return getDmChatId(activeUserId, chatId.replace('dm:', '')) || chatId;
  }

  return chatId;
}

function inferChatName({ chatId, normalizedId, messages, chatMeta = {}, authUsers = [], activeUserId }) {
  const existing = chatMeta[normalizedId]?.name || chatMeta[chatId]?.name;
  if (existing) return existing;

  if (!normalizedId.startsWith('dm:')) {
    return normalizedId.startsWith('group:')
      ? normalizedId.replace('group:', '').replace(/-/g, ' ')
      : normalizedId;
  }

  const participants = inferParticipants(normalizedId, messages, activeUserId);
  const otherId = participants.find((id) => id !== activeUserId) || participants[0];
  const otherUser = authUsers.find((user) => user.id === otherId);
  if (otherUser) return otherUser.username || otherUser.name || otherId;

  const namedMessage = messages.find((msg) => msg?.senderId === otherId && msg?.senderName);
  return namedMessage?.senderName || otherId || 'User';
}

function normalizeMessage({ message, chatId, participants, activeUserId, index }) {
  const createdAt = toMillis(message.createdAt || message.timestamp) || (Date.now() + index);
  const isDm = chatId.startsWith('dm:');
  const senderId = message.senderId
    || (message.dir === 'outgoing' ? activeUserId : null)
    || (message.dir === 'incoming' ? participants.find((id) => id !== activeUserId) : null)
    || participants[0]
    || activeUserId
    || 'unknown-user';
  const receiverId = isDm
    ? (message.receiverId || participants.find((id) => id !== senderId) || null)
    : (message.receiverId || null);
  const normalizedParticipants = Array.isArray(message.participants) && message.participants.length
    ? [...new Set(message.participants.filter(Boolean))]
    : participants;
  const id = message.id || message.docId || `${chatId}:${createdAt}:${index}`;

  return {
    ...clone(message),
    id,
    docId: message.docId || id,
    chatId,
    createdAt,
    senderId,
    receiverId,
    participants: normalizedParticipants,
    senderName: message.senderName || message.name || '',
    files: Array.isArray(message.files) ? clone(message.files) : [],
    deliveredTo: Array.isArray(message.deliveredTo) ? [...new Set(message.deliveredTo.filter(Boolean))] : (senderId ? [senderId] : []),
    readBy: Array.isArray(message.readBy) ? [...new Set(message.readBy.filter(Boolean))] : (senderId ? [senderId] : []),
    status: message.status || 'sent',
    text: message.text || '',
    dir: message.dir || (senderId === activeUserId ? 'outgoing' : 'incoming')
  };
}

export function buildBackupImportPayload(parsed, { activeUserId = null, authUsers = [], existingChatMeta = {} } = {}) {
  const sourceChatStore = parsed?.chatStore && typeof parsed.chatStore === 'object' ? parsed.chatStore : { General: [] };
  const importedChatMeta = parsed?.chatMeta && typeof parsed.chatMeta === 'object' ? parsed.chatMeta : {};
  const mergedMeta = { ...clone(existingChatMeta || {}), ...clone(importedChatMeta || {}) };
  const normalizedChatStore = {};
  const conversations = [];
  const nextChatMeta = { ...mergedMeta };

  for (const [rawChatId, rawMessages] of Object.entries(sourceChatStore)) {
    const messages = Array.isArray(rawMessages) ? rawMessages : [];
    const normalizedId = normalizeChatId(rawChatId, messages, activeUserId);
    const participants = inferParticipants(normalizedId, messages, activeUserId);
    if (activeUserId && participants.length && !participants.includes(activeUserId)) continue;
    if (!messages.length) continue;
    const normalizedMessages = messages
      .map((message, index) => normalizeMessage({ message, chatId: normalizedId, participants, activeUserId, index }))
      .map((message) => ({
        ...message,
        visibleTo: activeUserId ? [activeUserId] : (Array.isArray(message.visibleTo) ? message.visibleTo : undefined)
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    normalizedChatStore[normalizedId] = normalizedMessages;

    const latest = normalizedMessages.at(-1);
    const name = inferChatName({ chatId: rawChatId, normalizedId, messages: normalizedMessages, chatMeta: nextChatMeta, authUsers, activeUserId });

    nextChatMeta[normalizedId] = {
      ...(nextChatMeta[normalizedId] || {}),
      id: normalizedId,
      name,
      participants,
      isGroup: normalizedId.startsWith('group:'),
      typingUsers: nextChatMeta[normalizedId]?.typingUsers || {},
      visibleTo: activeUserId ? [activeUserId] : (nextChatMeta[normalizedId]?.visibleTo || undefined),
      clearedAtBy: nextChatMeta[normalizedId]?.clearedAtBy || {}
    };

    conversations.push({
      id: normalizedId,
      participants,
      isGroup: normalizedId.startsWith('group:'),
      name,
      lastMessage: latest?.text || (latest?.files?.length ? '📎 Attachment' : 'No messages yet'),
      updatedAt: latest?.createdAt || 0,
      visibleTo: activeUserId ? [activeUserId] : undefined,
      clearedAtBy: {}
    });
  }

  conversations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return {
    chatStore: normalizedChatStore,
    uploads: Array.isArray(parsed?.uploads) ? clone(parsed.uploads) : [],
    chatMeta: nextChatMeta,
    conversations,
    activeChat: conversations[0]?.id || Object.keys(normalizedChatStore)[0] || null
  };
}

export async function persistImportedChatsToFirestore({ db, backup, setDoc, doc, collection }) {
  if (!db) throw new Error('Firestore database instance is required for backup import.');
  if (typeof setDoc !== 'function' || typeof doc !== 'function' || typeof collection !== 'function') {
    throw new Error('Firestore helper functions are required for backup import.');
  }

  const writes = [];

  for (const conversation of backup.conversations || []) {
    const convRef = doc(db, 'conversations', conversation.id);
    writes.push(setDoc(convRef, {
      ...conversation,
      updatedAt: conversation.updatedAt || Date.now()
    }, { merge: true }));
  }

  for (const [chatId, messages] of Object.entries(backup.chatStore || {})) {
    for (const message of messages || []) {
      const msgRef = doc(collection(db, 'messages'), message.id);
      writes.push(setDoc(msgRef, {
        ...message,
        chatId,
        createdAt: message.createdAt || Date.now()
      }, { merge: true }));
    }
  }

  await Promise.all(writes);
}
