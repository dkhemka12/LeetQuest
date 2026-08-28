# LeetQuest Product Requirements Document

## 1. Product Summary

LeetQuest helps people build a consistent LeetCode habit by converting public LeetCode progress into understandable goals, rewards, analytics, and friendly competition. The product complements LeetCode rather than reproducing its coding workflow.

## 2. Users and Jobs to Be Done

### Learner

After solving on LeetCode, I want my progress to sync automatically so I can see growth without manual tracking.

### Competitive learner

I want XP, streaks, challenges, friends, clans, and leaderboards so that consistency has visible social accountability.

### Visitor

I want to inspect a public profile or contact the team without creating an account.

### Administrator

I want to moderate users and manage challenges/clans so that the community remains useful and trustworthy.

## 3. Product Goals and Success Metrics

- Increase weekly active learners who sync at least once.
- Increase the percentage of active learners with activity on multiple days per week.
- Make sync results trustworthy: successful syncs, duplicate-free activity history, and clear failure messaging.
- Encourage social retention through friend, clan, and challenge participation.

Suggested initial metrics: weekly active users, sync success rate, seven-day returning users, median active days per week, challenge completion rate, and verified-account conversion.

## 4. Functional Requirements

### P0: Account and onboarding

- Register with unique username/email and securely hashed password.
- Verify email with an expiring OTP; support resend.
- Log in and receive a JWT session.
- Recover and reset a forgotten password with an expiring token.
- Complete a profile and connect a public LeetCode username.
- Block banned users from authenticated use.

### P0: Progress and sync

- Show solved totals by difficulty, XP, level, streak, consistency score, badges, and last sync time.
- Sync public LeetCode profile data and recent accepted submissions.
- Allow a user to retry sync and clear-and-resync their own imported activity.
- Keep problem links directed to LeetCode.
- Show useful empty, loading, stale, and provider-error states.

### P1: Insights and history

- Provide dashboard summary and recent activity.
- Provide analytics for activity, topic trends, streaks, and consistency.
- Provide a paginated or bounded history of imported solved questions.

### P1: Social and competition

- Search users and add/remove friends.
- Show public profiles and leaderboard comparisons.
- Create, join, and leave clans; view and post town-hall messages.
- View daily challenges and create/update friend or clan challenges.
- Show challenge progress, deadline, status, and winner where applicable.

### P1: Support and administration

- Allow public contact and feedback submission by email.
- Allow admins to view statistics and activity.
- Allow admins to inspect, update, ban/unban, or delete users.
- Allow admins to manage challenges and clans.

## 5. Non-Functional Requirements

- Protect credentials and tokens; never return secrets in API responses.
- Use HTTPS in deployed environments and restrict CORS to approved frontend origins.
- Make sync idempotent and resilient to LeetCode rate limits or downtime.
- Keep normal dashboard reads fast through stored aggregates and appropriate indexes.
- Make core flows usable on desktop and mobile, with accessible labels, keyboard navigation, and visible error states.
- Preserve user control over account and imported activity data.

## 6. UX Acceptance Criteria

- A new user can register, verify, log in, complete onboarding, and reach a populated dashboard.
- A valid LeetCode username produces updated totals and activity; an invalid or unavailable profile produces an actionable error without corrupting prior data.
- Repeating sync does not duplicate activities or inflate XP.
- A user can find a public profile without exposing private account fields.
- Unauthorized users cannot call protected or admin operations by bypassing the UI.
- A banned user cannot continue using authenticated features.
- Support and feedback forms confirm submission only after the email provider accepts the message.

## 7. Scope Boundaries and Assumptions

- LeetCode remains the source of truth for problem solving and accepted submissions.
- Imported history is limited by the data available from the current LeetCode integration; it is not a complete archival service.
- Daily challenges initially use a curated internal question bank.
- Support messages are email-only and are not searchable in LeetQuest.
- Browser-side periodic sync may remain as a convenience, but production reliability requires server-side scheduling.

## 8. Release Plan

### MVP

Authentication, onboarding, LeetCode sync, dashboard, XP/level/streak, activity history, public profile, and basic admin moderation.

### Release 2

Analytics, badges, friends, leaderboard, clans, challenges, and support workflows.

### Hardening

Server-side scheduled sync, validation, rate limits beyond auth, observability, automated tests, authorization audit, email configuration cleanup, and production deployment controls.

## 9. Open Product Decisions

- Should users be able to choose a sync timezone and streak grace policy?
- What exact XP-to-level curve and badge catalog should be product-owned and versioned?
- Should friend relationships be mutual approval or immediate following?
- Should challenge status be verified from LeetCode activity, or manually reported?
- How long should imported activity, clan messages, and account recovery data be retained?
