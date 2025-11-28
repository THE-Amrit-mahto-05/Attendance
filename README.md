# ClassCheck – Coaching Class Attendance Tracker

Mono-repo containing the Expo React Native mobile app (`frontend/`) and the Node.js + MongoDB API (`backend/`) for tracking coaching class attendance, insights, and defaulter reports.

## Requirements Recap

- Maintain batches/classes and student roster with contact info.
- Record attendance per batch/date with Present, Absent, or Late statuses and the ability to edit earlier dates.
- Generate per-student history, per-batch summaries, and defaulter lists below a configurable percentage.

## Stack Overview

| Layer     | Tech                                                                                                                                         |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Mobile    | Expo (React Native 0.81), Expo Router, Axios, `@react-native-picker/picker`, `date-fns`                                                      |
| Backend   | Node.js (Express 5), MongoDB via Mongoose, CORS, dotenv, morgan                                                                              |

The mobile client expects `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`).

## Getting Started

### Backend

```bash
cd backend
cp env.sample .env            # fill in MONGO_URI / PORT
npm install
npm run dev                   # starts Express API on port 4000
```

Key endpoints:

- `POST /api/batches`, `GET /api/batches`
- `POST /api/students`, `GET /api/students?batch=<id>`
- `POST /api/attendance/bulk`, `GET /api/attendance?batch=<id>&date=2025-11-28`
- `GET /api/reports/student/:id`
- `GET /api/reports/batch-summary?batch=<id>&date=2025-11-28`
- `GET /api/reports/defaulters?batch=<id>&month=11&year=2025&threshold=75`

### Frontend

```bash
cd frontend
echo "EXPO_PUBLIC_API_URL=http://localhost:4000/api" > .env
npm install
npm start                     # launches Expo bundler
```

Screens shipped (all JSX-based Expo Router routes):

- Dashboard tab (`/(tabs)/index`) with quick routing tiles and schedule timeline
- Attendance tab (`/(tabs)/attendance`) with batch/date filters and live chips
- Insights tab (`/(tabs)/insights`) covering per-student stats, per-batch snapshot, and defaulter radar
- Batch management stack screen (`/batches`)
- Student management stack screen (`/students`)
- Advanced defaulter filters (`/defaulters`)

## Project Structure

```
frontend/    Expo Router app (UI, API client, feature screens)
backend/     Express + Mongo API (models, routes, config)
```

## Next Steps

- Plug in authentication/user roles if needed.
- Add push notifications or reminders for daily attendance.
- Package builds via EAS for distribution.

