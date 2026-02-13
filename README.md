# ChatBhar Web (Landing + Primary Messaging)

A modern, glassmorphism-inspired web app concept for **ChatBhar**, blending Instagram/YouTube/chat ideas into a landing experience with a functional **chat and file attachment workflow**.

## Implemented now

- Landing page with:
  - brand header, search bar, stories row, reel-style feed card
  - bottom navigation for Home / Explore / Post / Channels / Chat
  - quick navigation cards to jump across tabs
- Theme toggle (light/dark)
- Chat inbox UI with conversation list
- Messaging composer that supports:
  - text messages
  - multiple file attachments
  - attachment preview before sending
  - sent-message rendering with attached file names

## Run locally

Because this is plain HTML/CSS/JS, you can run it with any static server.

```bash
python3 -m http.server 4173
```

Then open: `http://localhost:4173`

## Project files

- `index.html` – app layout and sections
- `styles.css` – visual design, responsive layout, glassmorphism theme
- `app.js` – tab navigation, chat interactions, attachment handling, theme toggle
