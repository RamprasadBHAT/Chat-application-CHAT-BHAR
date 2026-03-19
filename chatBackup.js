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

function normalizeChatId(chatId, messages, activeUserId, authUsers = []) {
  if (!chatId) return 'General';
  if (chatId === 'General' || chatId.startsWith('group:')) return chatId;

  let otherUid = null;
  if (chatId.startsWith('dm:')) {
    const content = chatId.replace('dm:', '');
    if (content.includes('_')) {
      const parts = content.split('_').filter(Boolean);
      if (parts.length === 2) {
        const sorted = parts.sort();
        return `dm:${sorted[0]}_${sorted[1]}`;
      }
      otherUid = parts.find(p => p !== activeUserId) || parts[0];
    } else {
      otherUid = content;
    }
  } else {
    // Bare UID or Username
    otherUid = chatId;
    const userByUsername = (authUsers || []).find(u => u.username?.toLowerCase() === chatId.toLowerCase());
    if (userByUsername) otherUid = userByUsername.id;
  }

  // If we have an activeUserId and identified an otherUid, unify
  if (activeUserId && otherUid && otherUid !== activeUserId) {
    return getDmChatId(activeUserId, otherUid) || chatId;
  }

  // Fallback: Infer from participants in messages
  const participants = inferParticipants(chatId, messages, activeUserId);
  if (participants.length >= 2) {
    return getDmChatId(participants[0], participants[1]) || chatId;
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

  // Use a fingerprint for deterministic ID to prevent duplicates
  // Fingerprint: sender + timestamp + text (first 50 chars) + chatId
  const textFragment = String(message.text || '').slice(0, 50).replace(/\s+/g, '_');
  const fingerprint = `msg:${senderId}:${createdAt}:${textFragment}:${chatId}`;
  const id = message.id || message.docId || fingerprint;

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
    dir: message.dir || (senderId === activeUserId ? 'outgoing' : 'incoming'),
    // Requirement: Imported messages are visible only to the importer by default
    // unless they already have a visibleTo array.
    visibleTo: Array.isArray(message.visibleTo) ? message.visibleTo : [activeUserId].filter(Boolean)
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
    const normalizedId = normalizeChatId(rawChatId, messages, activeUserId, authUsers);
    const participants = inferParticipants(normalizedId, messages, activeUserId);
    const normalizedMessages = messages
      .map((message, index) => normalizeMessage({ message, chatId: normalizedId, participants, activeUserId, index }))
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
      typingUsers: nextChatMeta[normalizedId]?.typingUsers || {}
    };

    const existingConvIdx = conversations.findIndex(c => c.id === normalizedId);
    const convData = {
      id: normalizedId,
      participants,
      isGroup: normalizedId.startsWith('group:'),
      name,
      lastMessage: latest?.text || (latest?.files?.length ? '📎 Attachment' : 'No messages yet'),
      updatedAt: latest?.createdAt || 0
    };

    if (existingConvIdx !== -1) {
      if (convData.updatedAt > conversations[existingConvIdx].updatedAt) {
        conversations[existingConvIdx] = convData;
      }
    } else {
      conversations.push(convData);
    }
  }

  if (!Object.keys(normalizedChatStore).length) {
    normalizedChatStore.General = [];
  }

  conversations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return {
    chatStore: normalizedChatStore,
    uploads: Array.isArray(parsed?.uploads) ? clone(parsed.uploads) : [],
    chatMeta: nextChatMeta,
    conversations,
    activeChat: conversations[0]?.id || Object.keys(normalizedChatStore)[0] || 'General'
  };
}

export async function persistImportedChatsToFirestore({ db, backup, setDoc, getDoc, updateDoc, doc, collection, arrayUnion, activeUserId }) {
  if (!db) throw new Error('Firestore database instance is required for backup import.');
  if (typeof setDoc !== 'function' || typeof doc !== 'function' || typeof collection !== 'function') {
    throw new Error('Firestore helper functions are required for backup import.');
  }

  // Optimize conversations: process in parallel
  const convTasks = (backup.conversations || []).map(async (conversation) => {
    const convRef = doc(db, 'conversations', conversation.id);
    const convSnap = await getDoc(convRef);

    if (convSnap.exists()) {
      if (typeof arrayUnion === 'function' && typeof updateDoc === 'function') {
        const updates = {
          participants: arrayUnion(activeUserId),
          visibleTo: arrayUnion(activeUserId),
          updatedAt: Math.max(convSnap.data().updatedAt || 0, conversation.updatedAt || 0)
        };
        updates[`clearedAtBy.${activeUserId}`] = 0;
        return updateDoc(convRef, updates);
      }
    } else {
      return setDoc(convRef, {
        ...conversation,
        updatedAt: conversation.updatedAt || Date.now(),
        participants: conversation.participants || [activeUserId],
        visibleTo: conversation.visibleTo || [activeUserId]
      });
    }
  });

  await Promise.all(convTasks);

  // Optimize messages: process in chunks to avoid overwhelming the network
  const CHUNK_SIZE = 25;
  const allMessages = Object.entries(backup.chatStore || {}).flatMap(([chatId, msgs]) => msgs.map(m => ({ ...m, chatId })));

  for (let i = 0; i < allMessages.length; i += CHUNK_SIZE) {
    const chunk = allMessages.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map(async (message) => {
      const msgRef = doc(collection(db, 'messages'), message.id);
      const msgSnap = await getDoc(msgRef);

      if (msgSnap.exists()) {
        const existingData = msgSnap.data();
        if (existingData.visibleTo && Array.isArray(existingData.visibleTo)) {
          if (typeof arrayUnion === 'function' && typeof updateDoc === 'function') {
            return updateDoc(msgRef, {
              visibleTo: arrayUnion(activeUserId)
            });
          }
        }
      } else {
        return setDoc(msgRef, {
          ...message,
          createdAt: message.createdAt || Date.now(),
          visibleTo: [activeUserId]
        });
      }
    }));
  }
}
