# ChatBhar Web (Interactive Landing + Local Messaging)

A modern, glassmorphism-inspired web app prototype for **ChatBhar** with proper login-first navigation, richer chat, and client-side backup flows.

## Implemented now

- Landing app shell inspired by Instagram + YouTube + chat apps:
  - stories, feed preview, search, bottom nav, feature cards
- Light/dark mode toggle
- **Primary chat/messaging upgraded**:
  - multiple conversations with dynamic switching
  - create new chats/groups
  - text messages + multi-file attachments
  - supports all file formats accepted by browser file picker
  - attachment previews with type-aware icons
  - sent files are shown as downloadable links in chat
- **Client-only backup model** (no server DB required for this demo):
  - auto-save chat state to browser local storage
  - export backup JSON
  - import backup JSON
  - mobile save flow via Web Share API (when supported)
- **Auth + roles (front-end demo only)**:
  - seeded admin account
  - seeded first creator/user account for **Ramprasad Bhat**

## Seeded accounts

- Admin:
  - email: `admin@chatbhar.app`
  - password: `Admin@1234`
- First creator/user:
  - name: `Ramprasad Bhat`
  - email: `ramprasadbhat@gmail.com`
  - password: `Ram@1234`

> Change passwords for production use.

## Important note

This is a front-end prototype. Passwords and chat data are stored locally in browser storage for demonstration; production deployment should use secure backend auth, encryption, and managed backup architecture.

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Project files

- `index.html` – auth gate, app shell, tabs, chat tools, admin console
- `styles.css` – visual theme, responsive design, glassmorphism UI
- `app.js` – auth/session logic, chat state, attachments, backup import/export, mobile share
