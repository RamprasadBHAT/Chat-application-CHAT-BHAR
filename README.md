# ChatBhar Web (Interactive Landing + Messaging)

A modern, glassmorphism-inspired web app prototype for **ChatBhar** with login-first navigation, interactive chat, and file sharing.

## Implemented now

- Login-first UX (auth screen appears first, app opens only after login)
- No pre-seeded users (all users are created through signup)
- Landing app shell inspired by Instagram + YouTube + chat apps
- Primary chat features:
  - create new chats
  - switch between chats
  - delete current chat
  - send text and multi-format files
  - show sent files as downloadable links
- Chat options are moved into a **3-dot menu** in chat header:
  - export backup
  - import backup
  - save to phone
  - delete current chat
- Light/dark mode toggle

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Project files

- `index.html` – auth gate, app shell, chat menu
- `styles.css` – visual theme and responsive styles
- `app.js` – auth/session, chat, file sending, 3-dot menu actions
