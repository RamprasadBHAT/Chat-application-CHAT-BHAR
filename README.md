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
- Explore tab with active-user search (name/email) and active status sorting
- Home feed with lazy-loaded media and public interactions:
  - like / comment / share
  - full-screen post viewer with live comment thread updates
- Channels dashboard (card-based):
  - edit metadata
  - re-open creative suite
  - delete with confirmation modal
- WhatsApp-inspired messaging module:
  - pre-send full-screen image preview
  - in-chat image rendering with aspect-ratio aware bubbles
  - view-once image toggle and one-time visibility logic
  - dynamic naming (hide common image filenames, show docs/PDF names)
  - typing indicator + online/offline presence via realtime channel abstraction
  - contact selection from registered users + create group flow
- Chat module preserved (attachments, backup menu)

## Performance notes

- Feed media uses `loading="lazy"` to reduce initial load cost.
- `cdnUrl()` abstraction is included in JS for future CDN URL swapping.

## Run locally

To run the application with full backend support (Login, Signup, Chat, and Media Uploads), use:

```bash
npm start
```

Open: `http://localhost:4173`

> **Note:** Do not use `python3 -m http.server` or other static file servers, as they do not support the `POST` requests required for authentication and messaging, which will result in a **405 Method Not Allowed** error.

## Implemented capabilities

- Strict authentication + profile management:
  - Signup accepts only `@gmail.com` email IDs
  - Manual credentials (email + password)
  - Password minimum length validation
  - Onboarding flow: account creation/login without active username redirects to username setup
- Username business logic:
  - up to 5 usernames per Gmail account
  - global username uniqueness check via API (`POST /api/usernames/check`)
  - timestamped username change logs
  - middleware-style monthly policy enforcement (max 3 username changes/month) on username update endpoint
- Backend user store (NoSQL JSON schema) linking one EmailID to many username records
- Admin reset endpoint to clear historical signups for fresh Gmail registrations:
  - `POST /api/admin/reset-signups`
- Multi-story and multi-content uploader with drag-and-drop
- Simulated **chunked + concurrent upload pipeline** for fast feedback
- Creative Suite editing + channel dashboard + chat module

## Storage Architecture

The application uses a hybrid storage model to ensure high performance and scalability (supporting 15GB+ media):

- **Metadata Database**: `db/auth-db.json` stores user profiles, post captions, and comments.
- **Binary Storage**: `uploads/` stores actual image and video files. This prevents database bloat and memory crashes.
- **Client Cache**: `localStorage` is used for session hydration, storing only lightweight URLs to the server assets.

## Database schema (NoSQL JSON)

`db/auth-db.json`

```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Full Name",
      "email": "user@gmail.com",
      "password": "...",
      "usernames": [
        { "id": "uuid", "value": "handle", "createdAt": 0, "updatedAt": 0 }
      ],
      "usernameChangeLogs": [
        { "ts": 0, "from": "oldHandle", "to": "newHandle" }
      ],
      "activeUsernameId": "uuid"
    }
  ]
}
```


## API highlights

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/users`
- `POST /api/usernames/check`
- `POST /api/usernames`
- `PATCH /api/usernames/:usernameId` (3 changes/month rule)
- `POST /api/admin/reset-signups`




