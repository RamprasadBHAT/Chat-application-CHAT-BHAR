# ChatBhar Web (Responsive Social + Chat App)

A modern, glassmorphism-inspired **responsive** web app prototype for ChatBhar.

## What is implemented

- **Login-first flow** (signup/login shown first; app opens after auth)
- **Device-adaptive UI**:
  - Mobile-first default (app-like form factor)
  - Desktop/web layout with left navigation rail + wider content + side panel (WhatsApp Web style)
- **Chat features**:
  - create, switch, and delete chats
  - send text and multi-format attachments
  - attached files shown as downloadable links
  - 3-dot menu for backup/import/save-to-phone/delete
- **Content upload features**:
  - upload caption + multiple files in Post tab
  - uploaded files rendered as downloadable list
  - uploads persisted locally
- Light/dark mode toggle

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Files

- `index.html` – responsive structure, auth, tabs, chat and upload sections
- `styles.css` – mobile + desktop adaptive styling
- `app.js` – auth, chat, file handling, upload handling, backup actions
