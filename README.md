# PROJECT OVERVIEW

# LeetQuest

LeetQuest is a gamified LeetCode productivity platform that helps users stay consistent, track progress, and compete with friends. It does not solve coding problems inside the app. Instead, it syncs public LeetCode data, calculates XP and streaks, shows analytics, and redirects users back to the real LeetCode problem links.

## What The Project Does

- Lets users register, verify email, log in, and manage their profile.
- Syncs LeetCode activity, solved counts, and recent submissions.
- Tracks XP, levels, streaks, badges, and consistency score.
- Provides dashboards, analytics, history, friends, clans, and challenges.
- Supports public profiles and leaderboard-style comparisons.
- Includes public send message and feedback pages that email the team directly.

## Key Product Rules

- Users do not solve problems inside LeetQuest.
- There is no coding editor, compiler, or judge system.
- Problem links always point back to LeetCode.
- Support requests are sent by email, not stored as app content.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts
- Framer Motion
- GSAP
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Nodemailer
- node-cron

## Project Structure

### Frontend

- `src/pages` - route-level screens such as dashboard, analytics, login, profile, message, and feedback.
- `src/components` - shared UI components.
- `src/layouts` - app shell and shared layouts.
- `src/context` - auth state and global UI state.
- `src/services` - API clients and client-side helpers.

### Backend

- `src/controllers` - request handlers.
- `src/routes` - API route definitions.
- `src/models` - Mongoose models.
- `src/services` - domain logic such as emails, XP, badges, streaks, and LeetCode sync.
- `src/middleware` - authentication and authorization.
- `src/utils` - helpers such as token generation and scoring.
- `src/cron` - scheduled jobs.

## Main Features

### Authentication

- Register and log in with JWT.
- Email verification with OTP.
- Password reset flow.
- Protected routes for authenticated users.
- Admin-only routes for moderation and management.

### LeetCode Sync

- Connect a LeetCode username.
- Fetch solved counts, recent submissions, and related public LeetCode data.
- Update XP, level, solved stats, and activity history.

### Dashboard And Analytics

- XP, level, streak, solved counts, and consistency score.
- Topic insights and recent activity.
- Charts and progress displays.
- History view for solved questions.

### Social And Competitive Features

- Friends list and comparison views.
- Clans and clan activity.
- Challenges and progress tracking.
- Public profile pages.

### Support

- Send Message and Feedback pages are available publicly.
- Submissions are emailed directly to the team.
- The email sender is configured through backend environment variables.

## Routes

### Public Frontend Routes

- `/` - landing page
- `/login` - sign in
- `/register` - sign up
- `/verify-otp` - email verification
- `/forgot-password` - request password reset
- `/reset-password/:resetToken` - reset password
- `/send-message` - contact the team
- `/feedback` - send product feedback
- `/user/:username` - public profile

### Authenticated Routes

- `/dashboard`
- `/analytics`
- `/challenges`
- `/friends`
- `/clans`
- `/profile`
- `/history`
- `/complete-profile`

### Admin Routes

- `/admin`
- `/admin/users`
- `/admin/challenges`
- `/admin/support`

## Backend API Overview

The backend serves REST endpoints under `/api`.

Common areas include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/verify-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/leetcode/sync`
- `GET /api/dashboard/...`
- `GET /api/users/...`
- `GET /api/admin/...`
- `POST /api/support`

## Environment Variables

### Backend `.env`

Required variables:

- `PORT` - backend port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - frontend base URL
- `EMAIL_USER` - Gmail account used to send emails
- `EMAIL_PASSWORD` - Gmail app password
- `ADMIN_EMAIL` - inbox that receives support messages and feedback
- `ADMIN_PASSWORD` - admin account password for seeding

### Frontend `.env`

Optional variables:

- `VITE_API_URL` - backend API base URL
- `VITE_GITHUB_URL` - GitHub profile or repository link
- `VITE_CONTACT_EMAIL` - optional contact email shown in the UI

## Local Development

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Run The Backend

```bash
cd backend
npm run dev
```

### Run The Frontend

```bash
cd frontend
npm run dev
```

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Start

```bash
cd backend
npm start
```

## Deployment

Deploy the backend as a long-running Node service, not a serverless function, so email sending and cron jobs can run reliably.

### Backend Environment

Set these variables in your hosting provider:

- `PORT` - use the platform-assigned port when required
- `MONGO_URI` - production MongoDB connection string
- `JWT_SECRET` - strong production secret
- `FRONTEND_URL` - your deployed frontend URL, for example `https://leetquest.example.com`
- `EMAIL_USER` - Gmail account used to send emails
- `EMAIL_PASSWORD` - Gmail app password
- `ADMIN_EMAIL` - inbox that receives support messages and feedback
- `ADMIN_PASSWORD` - admin password used by the seeder

Note: if you are deploying with Gmail SMTP, use a Gmail app password for `EMAIL_PASSWORD` rather than your normal account password.

### Frontend Environment

Set this variable in your frontend hosting provider:

- `VITE_API_URL` - full backend API base URL, for example `https://api.leetquest.example.com/api`

### Deployment Checklist

1. Deploy the backend and confirm it serves `/api/health`.
2. Deploy the frontend and point `VITE_API_URL` to the backend.
3. Set `FRONTEND_URL` to the public frontend domain so password reset links are correct.
4. Set `EMAIL_USER` and `EMAIL_PASSWORD` on the backend host using a Gmail app password.
5. Check the hosting logs if reset emails do not arrive — Gmail SMTP errors will be logged by the backend.
6. If Gmail blocks the send, switch to another SMTP provider later.

## Data Flow

1. A user registers or logs in.
2. The backend verifies credentials and issues a JWT.
3. The frontend stores the token and loads the dashboard.
4. LeetCode sync updates user stats and activity.
5. Analytics, history, and profile pages render the synced data.
6. Message and feedback forms send email to the configured admin inbox.

## Notes For Submission

- The project is structured as a full-stack production app.
- The UI is componentized and route-based.
- The backend is organized around controllers, services, models, and middleware.
- Support requests are emailed directly, which keeps the app lightweight and avoids storing contact messages in the database.

## License

This project is currently not assigned a license.