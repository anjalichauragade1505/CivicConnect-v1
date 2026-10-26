// Centralized backend base URL.
// Set VITE_API_URL in a .env file to point at your deployed backend
// (e.g. VITE_API_URL=https://api.yourdomain.com/api) — this is required
// for the app to work as a mobile app / on any device other than your dev machine.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
