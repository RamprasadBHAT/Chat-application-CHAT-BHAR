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
- Story upload UX:
  - title and description are optional for Stories
  - smooth upload progress bar simulation
- Upload UI improvements:
  - drag-and-drop upload box (browse or drop files)
  - selected file previews before publish
  - YouTube publish-inspired button styling
- Home reflection of uploaded content:
  - Story row uses uploaded stories from registered users only
  - Feed shows uploaded Shorts/Carousel/LTV
  - Story viewer supports next/prev + image/video
- Channel (profile) management in **Channels** tab:
  - manage only logged-in user uploads
  - edit title and description
  - upload thumbnail after upload
  - set video trim start/end values
  - add music file from device (stored for future processing)
  - delete uploaded content
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

- `index.html` – app structure, upload modes, story viewer, channel manager
- `styles.css` – responsive styles and upload/home/story/channel visuals
- `app.js` – auth, uploads, feed/story rendering, channel editing tools, chat and backup logic
