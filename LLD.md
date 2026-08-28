# LeetQuest Low-Level Design

## 1. Repository Layout

```text
backend/src/
  app.js, server.js              HTTP bootstrap and database startup
  routes/                        URL-to-controller mapping
  controllers/                   request validation and response orchestration
  services/                      domain logic and integrations
  models/                        Mongoose schemas
  middleware/                    JWT and admin authorization
  utils/                         scoring, analytics, and token helpers
frontend/src/
  App.jsx                        route tree
  context/                       authentication state
  pages/                         route-level screens
  components/                    reusable UI
  services/                      Axios API clients and sync helper
```

## 2. Domain Model

### User

Required identity fields are `username`, `email`, and hashed `password`. Profile fields include names, LeetCode username, preferred topics, and completion state. Progress fields include `xp`, `level`, `streak`, `consistencyScore`, easy/medium/hard solved totals, badges, and `lastSyncedAt`. Social references are an array of `friends` pointing to `User` documents. Moderation and account recovery fields include admin/ban flags, OTP data, email verification, and password reset data.

### Activity

An activity belongs to a user and records a solved-question or account event, including problem title/slug, topic, difficulty, and timestamp. It is the source for history, streak, and consistency calculations. The LeetCode adapter currently limits imported accepted submissions to the recent set returned by the integration.

### Challenge

A challenge stores its creator, opponent and/or clan references, problem/topic metadata, target count, deadline, status, and winner. Daily challenge options are generated from the application's question bank; they are not a dynamic LeetCode catalog.

### Clan

A clan stores its owner, member references, invite code, and embedded town-hall messages. Embedded messages are appropriate for the current bounded feature, but should be moved to a separate collection if volume or retention becomes unbounded.

### Badge

Badge metadata is modeled separately, while user badge assignments are currently stored as strings on `User`. A future revision should use a consistent reference or immutable badge identifiers.

## 3. API Contracts

All API paths are prefixed with `/api`. Authenticated routes require a JWT bearer token.

| Area | Operations |
| --- | --- |
| Auth | register, login, profile, verify/resend OTP, forgot password, reset password |
| Users | current profile/update, search, friends add/remove, leaderboard, activity history, public profile |
| LeetCode | sync status, sync, clear-and-resync |
| Dashboard | summary and analytics |
| Challenges | list, daily challenge/topics, create, status update |
| Clans | list/current, create, join/leave, town-hall read/write |
| Admin | statistics, user detail/update/delete/ban/unban/activity, challenge and clan management |
| Support | public message and feedback submission |

Successful responses should return JSON resources or `{ message }`; errors return `{ message }` with an appropriate 4xx/5xx status. The root health endpoints are `GET /` and `GET /api/health`.

## 4. Key Algorithms

### XP and level

XP is derived from solved difficulty totals:

```text
easy XP   = easySolved * 10
medium XP = mediumSolved * 25
hard XP   = hardSolved * 50
total XP  = easy XP + medium XP + hard XP
```

The level utility maps total XP to the current level. Recalculation must be deterministic and idempotent so a repeated sync cannot award duplicate XP.

### Activity analytics

Analytics groups stored activities by calendar date, identifies consecutive solved days for streaks, and computes a consistency score from activity distribution over the supported period. Date normalization should use one explicit timezone policy to prevent users near midnight from losing a day.

### Sync behavior

The sync service fetches public profile counts and recent accepted submissions, maps difficulty/topic fields, upserts or de-duplicates activities, updates the user aggregate, then runs gamification calculations. A clear-and-resync operation must delete only the requesting user's imported activity records before rebuilding them.

## 5. Request Boundaries

- Controllers should authenticate the request context and translate service results into HTTP responses.
- Services own calls to LeetCode, email, and gamification rules.
- Models own persistence shape and indexes, not business workflows.
- Frontend services own endpoint paths and Axios configuration; pages should not construct raw URLs.
- Admin authorization must be checked server-side even when the frontend hides admin navigation.

## 6. Validation and Failure Handling

- Validate required strings, usernames, email format, dates, challenge targets, and referenced users before writes.
- Reject invalid/expired OTP and reset tokens.
- Prevent self-friend operations, duplicate memberships, duplicate challenge submissions, and unauthorized challenge status changes.
- Return `401` for missing/invalid authentication, `403` for banned or insufficient privileges, `404` for missing resources, `409` for uniqueness/conflict errors, and `500` only for unexpected failures.
- Do not expose password, OTP, reset token, or internal provider details in responses.

## 7. Implementation Gaps to Resolve

- Register and make idempotent the daily sync and streak reset jobs.
- Move recurring sync from browser timers to a server-controlled scheduler or queue.
- Reconcile README Gmail/Nodemailer variables with the current email implementation and Resend configuration.
- Add ownership/membership checks to challenge status updates.
- Add request validation, tests, audit logging for admin actions, and consistent exclusion of banned/admin accounts from public rankings.
