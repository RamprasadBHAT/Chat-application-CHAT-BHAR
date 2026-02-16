# ChatBhar (Web Prototype)

A WhatsApp-inspired messaging module built inside a modern social-app landing shell.

## Implemented features

### Messaging core
- Bubble-based DM and group chat layout
- Contact picker (replaces old "New Chat")
- Group creation flow with multi-select contacts

### Enhanced media handling
- Pre-send image preview modal (full-screen style dialog)
- In-chat image rendering with aspect-ratio aware display
- View Once option for image messages
  - Once opened by receiver, media URL is removed from state
  - Message is replaced by `Photo` placeholder
- Dynamic naming
  - Image filenames hidden for JPG/PNG/WEBP/GIF style media
  - Filenames shown for docs/PDF

### Real-time indicators (socket-style)
- Typing indicator (`[User] is typing...`) based on keypress events
- Global online user count based on connection/disconnection events
- Implemented with `BroadcastChannel` as a local WebSocket fallback due environment package-install restrictions

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Note on Socket.IO

This environment blocks npm package fetches, so Socket.IO server/client dependencies could not be installed.
The code is structured around socket-style events (`presence:online`, `presence:offline`, `typing`) so it can be swapped to Socket.IO quickly when dependency install is available.
