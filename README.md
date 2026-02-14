# ChatBhar Web — High-Performance Social CMS + Channels

A responsive social media prototype with a CMS-style upload pipeline, creative suite editing, channel management dashboard, and interactive public feed.

## Implemented capabilities

- Login-first auth flow (signup/login before app access)
- Multi-story and multi-content uploader with drag-and-drop
- Simulated **chunked + concurrent upload pipeline** for fast feedback
- Creative Suite (pre-publish and re-open from channel cards):
  - video trim start/end metadata
  - text overlay, color styling, draggable placement
- Content formats:
  - Shorts (single video)
  - Carousel (multi-image)
  - LTV (single video + description)
  - Stories (image/video, 24h expiry, supports multiple story assets)
- Strict media preview ratios:
  - 16:9 (`1920x1080` style)
  - 9:16 (`1080x1920` style)
  - with `object-fit: cover`
- Home feed with lazy-loaded media and public interactions:
  - like / comment / share
  - full-screen post viewer with live comment thread updates
- Channels dashboard (card-based):
  - edit metadata
  - re-open creative suite
  - delete with confirmation modal
- Chat module preserved (create/switch/delete chats, attachments, backup menu)

## Performance notes

- Feed media uses `loading="lazy"` to reduce initial load cost.
- `cdnUrl()` abstraction is included in JS for future CDN URL swapping.

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`
