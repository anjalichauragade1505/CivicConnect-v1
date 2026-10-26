// src/config/cities.js
// Single source of truth for supported cities/districts.
// Add new cities here only — User, Report, and Admin all reference this list,
// so city-wise segregation stays consistent across the whole app.

const CITIES = ["Nagpur", "Pune", "Mumbai", "Nashik", "Aurangabad"];

module.exports = CITIES;
