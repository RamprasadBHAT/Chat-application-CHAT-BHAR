# ChatBhar Web — High-Performance Social CMS + Channels

A responsive social media prototype with a CMS-style upload pipeline, creative suite editing, channel management dashboard, interactive public feed, and Gmail-based authentication with username onboarding.

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

## Run locally

```bash
npm start
```

Open: `http://localhost:4173`

## API highlights

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/users`
- `POST /api/usernames/check`
- `POST /api/usernames`
- `PATCH /api/usernames/:usernameId` (3 changes/month rule)
- `POST /api/admin/reset-signups`
