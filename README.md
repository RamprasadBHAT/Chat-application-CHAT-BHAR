# ChatBhar Web (Responsive Social + Chat App)

A modern, glassmorphism-inspired responsive web app prototype for ChatBhar.

## What is implemented

- Login-first flow (signup/login shown first; app opens after auth)
- Device-adaptive UI:
  - Mobile-first app form factor
  - Desktop/web layout with left nav + wider main panel
- Instagram-style upload modes in **Post**:
  - Shorts (single video)
  - Multi-carousel image posts (multiple images)
  - Long-form video / LTV (single video + required description)
  - 24-hour Story (single image/video with 24h expiry)
- Home reflection of uploaded content:
  - Story row now uses uploaded stories from registered users
  - Feed shows uploaded Shorts/Carousel/LTV content
- Story viewer:
  - open stories by clicking user avatar
  - next/prev story navigation
- Chat features:
  - create/switch/delete chats
  - send text + multi-format attachments
  - 3-dot menu for backup/import/save/delete

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Files

- `index.html` – app structure, upload modes, story viewer
- `styles.css` – responsive styles and upload/home/story visuals
- `app.js` – auth, uploads, feed/story rendering, chat and backup logic
