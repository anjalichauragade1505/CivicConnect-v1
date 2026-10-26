// Keep this identical to the `status` enum in
// civic-connect-backend/src/models/Report.js
export const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

export const STATUS_LABELS = {
  Pending: { en: "Pending", hi: "लंबित" },
  "In Progress": { en: "In Progress", hi: "प्रगति पर" },
  Resolved: { en: "Resolved", hi: "हल हो गया" },
  Rejected: { en: "Rejected", hi: "अस्वीकृत" },
};
