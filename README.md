<<<<<<< HEAD
# Civic Connect

A citizen-to-government grievance reporting platform. Citizens report local civic
issues (potholes, broken streetlights, garbage, water/electricity problems) with a
photo and location; city admins see and resolve only the reports from their own city.

This README documents what was broken, what was fixed, how to run the project, and
how to turn it into a mobile app.

---

## 1. What was broken (and the actual root cause)

Almost every bug traced back to **one inconsistency**: the citizen's/admin's city
field was named differently in different places (`area` in the User model,
`district` in the unused `Admin` model and seed script, `district` again in the
report form) — so nothing ever matched, and city-wise filtering silently failed.

| # | Bug | File(s) | Effect |
|---|-----|---------|--------|
| 1 | `getReportsByArea` had **no city/area filter at all** (comment said "remove area filter for now") | `adminController.js` | Every admin saw every report from every city |
| 2 | Admin seed script set `district: "Nagpur"` but the schema field was `area` | `scripts/createAdmin.js`, `models/User.js` | New admins had **no city saved at all** — Mongoose silently drops unknown fields |
| 3 | Citizens never picked a city at registration; `createReport` used `citizen.area` (always undefined) instead of the city the citizen *did* pick on the report form | `authController.js`, `Register.jsx`, `reportController.js`, `CreateReport.jsx` | Every report saved with `area: "Unknown"` |
| 4 | A second, unused `Admin` mongoose model existed with no password hashing, referenced only as dead-code fallback in the auth middleware | `models/Admin.js`, `middleware/authMiddleware.js` | Confusing, unused, and a security smell (unhashed password field) |
| 5 | `getSingleReport` (in `reportController.js`) used `mongoose.Types.ObjectId` but never imported `mongoose` | `reportController.js` | Crashed with `ReferenceError` on every call — though this exact function was also dead code since routes pointed to a different file |
| 6 | Two different controllers (`reportController.js` and `adminController.js`) each had their own copy of `getSingleReport`/`updateReportStatus`; routes used the `adminController` versions, so the `reportController` versions were dead, confusing code | both controllers | Maintenance trap — easy to edit the wrong copy and see no effect |
| 7 | `App.jsx` imported `./pages/login.jsx` (lowercase) but the file is `Login.jsx` | `App.jsx` | **App fails to build/run entirely** on Linux/Mac or any production/mobile build (case-sensitive filesystems) |
| 8 | `ProtectedRoute` accepted an `adminOnly` prop but never read it | `ProtectedRoute.jsx` | Any logged-in citizen could open `/admin-dashboard` directly via URL |
| 9 | Report status values were inconsistent across 3 different files: model enum had `"Inprogress"`, the admin dashboard filtered for `"In Progress"`, and the report-details page used a completely different set (`Submitted`/`Under Review`/...) | `Report.js`, `AdminDashboard.jsx`, `AdminReportDetails.jsx` | "In Progress" tab always showed 0 results; changing status to "Submitted" failed Mongoose validation |
| 10 | An unauthenticated debug route (`/api/reports/debug-populate`) returned any report in the database to anyone | `reportRoutes.js` | Data leak, no auth required |
| 11 | Tailwind was imported in `index.css` but `@tailwindcss/vite` was never added to `vite.config.js` | `vite.config.js` | Every Tailwind utility class in the app (e.g. on the report image) silently did nothing |
| 12 | API base URL (`http://localhost:3001`) was hardcoded in 6+ files | `Login.jsx`, `Register.jsx`, `CreateReport.jsx`, `MyReports.jsx`, `AdminDashboard.jsx`, `AdminReportDetails.jsx` | App only ever works on the developer's own laptop — breaks immediately on any phone, deployed server, or anyone else's machine |
| 13 | The repo's `.env` (committed/zipped) contained a **live MongoDB Atlas username and password** | `civic-connect-backend/.env` | Real credential exposure |
| 14 | No backend `.gitignore` | `civic-connect-backend/` | `.env` and `node_modules` had nothing stopping them from being committed/shared |

**⚠️ Action needed from you:** because a real database password was sitting in the
uploaded `.env` file, please **rotate/change that MongoDB Atlas password now** (Atlas
dashboard → Database Access → edit user → reset password) and update your real `.env`
with the new one. I replaced it with a placeholder in this delivery — I did not reuse
or transmit the original password anywhere.

---

## 2. What changed, by area

### Backend
- **City is now a first-class field** (`city`, not `area`/`district`), defined once in
  `src/config/cities.js` and reused everywhere (`User`, `Report`, registration,
  admin creation). Add a new city in **one place** and it's available everywhere.
- `city` is **required for admins**, optional for citizens (citizens pick their city
  per-report, which is what the original UI already half-supported).
- `adminController.getReportsByCity` now actually filters: `Report.find({ city: req.user.city })`.
- Admins can no longer view or update a report outside their own city (403 if they try) —
  this didn't exist before at all.
- Removed the dead `Admin` model, the dead debug route, and duplicate dead controller code.
- Report status is one consistent enum everywhere: `Pending`, `In Progress`, `Resolved`, `Rejected`.
- Added input validation (city must be a real city, status must be a real status, etc.)
  with clear error messages instead of crashing or silently failing.
- `scripts/createAdmin.js` now takes city as a required argument and works per-city.

### Frontend
- Fixed the `login.jsx`/`Login.jsx` casing bug that broke the entire build on
  case-sensitive systems.
- `ProtectedRoute` now actually enforces `adminOnly` — citizens are redirected away
  from admin pages and vice versa.
- Added a real `AuthContext` (`src/context/AuthContext.jsx`) instead of scattered
  `localStorage.getItem` calls everywhere.
- Centralized API calls into one axios instance (`src/config/axiosInstance.js`) that
  auto-attaches the auth token and auto-logs-out on an expired/invalid token. **No more
  hardcoded `localhost:3001`** — the URL comes from `VITE_API_URL` in `.env`.
- Registration now includes an optional **city dropdown**; the report form's existing
  city dropdown is now actually used by the backend (previously ignored).
- Fixed `vite.config.js` so Tailwind actually runs.
- Finished the i18n setup that was half-wired (packages installed, but never
  initialized): added a complete Hindi translation file, initialized i18next in
  `main.jsx`, and wired translated text through every page. A language toggle (EN/हिं)
  is in the navbar.
- Replaced plain `<p>` error text with toast notifications (`react-toastify`) so errors
  and success messages are clearly visible and don't require scrolling to find.
- Added loading states, empty states (e.g. "you haven't reported anything yet" with a
  call-to-action button instead of a blank page), and friendlier copy.
- "Use my location" button on the report form now actually works (browser geolocation),
  instead of doing nothing.
- Admin dashboard now shows the admin's city in the header, and shows a card-based
  layout on small screens instead of an unusable squeezed table.
- Added a working mobile hamburger menu to the navbar (there was none before).
- Added Devanagari font loading so Hindi text renders properly instead of falling
  back to a font with no Hindi glyphs.

---

## 3. Running it locally

### Backend
```bash
cd civic-connect-backend
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run dev             # nodemon, auto-restarts on changes
# or: npm start          (plain node, for production)
```

Create your first admin (one per city you want to staff):
```bash
npm run seed:admin -- "Priya Sharma" priya@civicconnect.com "StrongPass1!" Nagpur
npm run seed:admin -- "Rahul Verma" rahul@civicconnect.com "StrongPass2!" Pune
```

### Frontend
```bash
cd civic-connect-frontend
npm install
cp .env.example .env   # default already points at localhost:3001, fine for local dev
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Adding a new city
Edit **one file**: `civic-connect-backend/src/config/cities.js`, and the matching
`civic-connect-frontend/src/config/cities.js`. Keep both lists identical.

---

## 4. Turning this into a mobile app

You asked specifically about this because citizens will mostly have only a phone —
this matters a lot for adoption. Here are your real options, from least to most work,
**while keeping the same backend and design**:

### Option A — Make it work great as a mobile *website* first (do this regardless)
Already done in this update: responsive navbar with hamburger menu, mobile card view
for the admin dashboard, working geolocation, larger tap targets. A citizen can already
add it to their home screen from Chrome/Safari ("Add to Home Screen") and it behaves
like an app icon. This costs nothing extra and should be your baseline either way.

### Option B — Make it a PWA (Progressive Web App) — recommended next step
Smallest step up from Option A. Add a web app manifest + service worker so it:
- installs with a real icon and splash screen,
- can show a basic offline page,
- can (with extra setup) send push notifications.

This is days of work, not weeks, reuses 100% of your existing React code, and is
usually "good enough" for a civic reporting use case. I can build this with you next
if you want — it mainly means adding a manifest file and a small service worker, no
rewrite needed.

### Option C — Wrap it as a native app shell (Capacitor)
[Capacitor](https://capacitorjs.com/) packages your existing React build into a real
Android/iOS app, giving access to native camera, GPS, and push notifications, while
reusing your current frontend almost unchanged. This is the standard path when a React
web app needs to become an installable app store app without a full rewrite. Rough
steps: `npm install @capacitor/core @capacitor/cli`, `npx cap init`, `npx cap add android`,
point it at your built `dist/` folder, then build in Android Studio / Xcode.

### Option D — Full native rewrite (React Native)
Only worth it if you eventually need deep native features (background location
tracking, rich offline sync, etc.) beyond what a wrapped web app gives you. This means
rewriting the UI layer in React Native while reusing your backend and business logic
as-is. Most civic-reporting apps do **not** need to go this far — start with B or C.

**My recommendation for this project specifically:** Option A (already done) → Option B
(PWA) → only move to Option C if you want it distributed via Play Store/App Store. The
backend you have needs zero changes for any of these options — it's already a clean
JSON API.

---

## 5. Known remaining gaps (not bugs, just things to decide on purpose)

- There's no "super admin" who can create city admins from the UI — right now it's a
  command-line script (`npm run seed:admin`). Worth a small admin-management screen
  later if you'll have many cities.
- Citizens can't currently edit their city after registering. If someone moves cities,
  they'd need to be updated directly in the database, or you add a profile-edit screen.
- Images are stored as base64 strings directly in MongoDB documents. This works fine
  at small scale but will make your database large and slow at high report volume —
  worth moving to actual file storage (e.g. S3, which `aws-sdk`/`multer-s3` are already
  installed for but unused) once you have meaningful traffic.
=======
# CivicConnect-v1
>>>>>>> 872611145599eb26ac29f05e67e312c1683a2f22
