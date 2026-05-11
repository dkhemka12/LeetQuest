# PROJECT OVERVIEW

Project Name:
LeetQuest

LeetQuest is a gamified LeetCode productivity and tracking platform.

IMPORTANT:
This is NOT a coding platform.
Users will NOT solve coding questions inside our app.

Instead:
- users connect their LeetCode username
- our app fetches public LeetCode data
- we gamify consistency, streaks, analytics, and competitions

The app acts as a motivational and productivity layer over LeetCode.

Users should always be redirected to actual LeetCode problem links.


--------------------------------------------------
# MAIN FEATURES
--------------------------------------------------

## Authentication
- JWT authentication
- register/login
- protected routes
- bcrypt password hashing

## LeetCode Sync
Users can connect their LeetCode username.

Backend fetches:
- solved problems count
- difficulty stats
- recent submissions
- contest stats
- activity history

Use unofficial LeetCode GraphQL APIs.

## Dashboard
Dashboard should display:
- streak
- XP
- level
- solved statistics
- topic analytics
- recent activity
- consistency score

## XP System
XP should be based on solved problems.

Example:
- Easy = 10 XP
- Medium = 25 XP
- Hard = 50 XP

## Streak System
Track daily solving consistency.

If user solves at least one problem:
- streak continues

If missed:
- streak resets

## Badges
Examples:
- 7 Day Streak
- 30 Day Streak
- Graph Master
- DP Warrior
- Contest Expert

## Friends System
Users can:
- add friends
- compare streaks
- compare XP
- view activity

## Challenges
Users can challenge friends.

Examples:
- Solve 5 DP questions in 3 days
- Weekly Graph Challenge

## Leaderboards
Global and friend leaderboards based on:
- XP
- streaks
- consistency score

## Weak Topic Detection
Analyze user activity and identify weak topics.

Example:
"You should practice Dynamic Programming more."

## Analytics
Show:
- topic progress
- solved history
- heatmaps
- charts
- consistency trends


--------------------------------------------------
# TECH STACK
--------------------------------------------------

Frontend:
- React
- Tailwind CSS
- React Router
- Axios
- Recharts

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

Other:
- node-cron
- GraphQL requests to LeetCode

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas


--------------------------------------------------
# PROJECT ARCHITECTURE
--------------------------------------------------

Use scalable folder structure.

Backend architecture:
- controllers
- routes
- models
- services
- middleware
- utils
- cron jobs

Business logic should stay inside services.

Examples:
- leetcodeService.js
- xpService.js
- streakService.js
- badgeService.js

Frontend should use:
- reusable components
- pages
- layouts
- context API

Keep code modular and beginner-friendly.


--------------------------------------------------
# CODING RULES
--------------------------------------------------

- Use beginner-friendly code
- Prefer readability over cleverness
- Use async/await
- Always use try/catch
- Use functional React components
- Use Tailwind CSS
- Use REST APIs
- Keep files modular
- Add comments for important logic
- Do NOT overengineer
- Do NOT introduce unnecessary abstractions
- Do NOT modify unrelated files
- Keep consistent naming conventions

Backend:
- Use CommonJS syntax

Frontend:
- Use React functional components only


--------------------------------------------------
# IMPORTANT PRODUCT RULES
--------------------------------------------------

- Users do NOT solve problems inside our app
- Never build a coding editor/compiler
- Never build a judge system
- Always redirect users to LeetCode

This is:
- a gamification platform
- a productivity platform
- an accountability platform
- an analytics platform

NOT a LeetCode clone.


--------------------------------------------------
# DATABASE DESIGN
--------------------------------------------------

## User Model

Fields:
- username
- email
- password
- leetcodeUsername
- xp
- level
- streak
- badges
- friends
- consistencyScore

Stats:
- easySolved
- mediumSolved
- hardSolved

## Challenge Model
Fields:
- creator
- opponent
- topic
- difficulty
- targetQuestions
- deadline
- status
- winner

## Activity Model
Tracks:
- solved problems
- dates
- topics
- difficulty


--------------------------------------------------
# UI STYLE
--------------------------------------------------

Design should feel:
- modern
- clean
- minimal
- gamified

Use:
- cards
- gradients
- progress bars
- charts
- achievement badges

Dashboard should feel motivating and addictive.

Use responsive design.


--------------------------------------------------
# DEVELOPMENT APPROACH
--------------------------------------------------

IMPORTANT:
Work feature-by-feature.

Do NOT attempt to build the entire app at once.

When given a task:
1. analyze existing structure
2. implement only requested feature
3. avoid unrelated modifications
4. keep code production-ready
5. explain important logic if necessary

Prefer small incremental improvements.


--------------------------------------------------
# INITIAL PRIORITY ORDER
--------------------------------------------------

1. MongoDB setup
2. Authentication
3. User model
4. LeetCode sync
5. Dashboard APIs
6. XP system
7. Streak system
8. Analytics
9. Friends system
10. Challenges
11. Leaderboards
12. Badges


--------------------------------------------------
# FINAL INSTRUCTION
--------------------------------------------------

Always follow:
- project architecture
- coding rules
- beginner-friendly style
- modular design

Prioritize maintainability and readability.