import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import api from "../config/axiosInstance";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await api.get("/admin/reports");
        setGrievances(res.data);
      } catch (err) {
        setError(err.response?.data?.message || t("fetch_reports_failed"));
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [t]);

  const statusCounts = {
    Pending: grievances.filter(g => g.status === "Pending").length,
    "In Progress": grievances.filter(g => g.status === "In Progress").length,
    Resolved: grievances.filter(g => g.status === "Resolved").length,
    Rejected: grievances.filter(g => g.status === "Rejected").length,
  };

  const recentActivity = grievances.slice(0, 5);

  const categoryCounts = grievances.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {});

  const filteredGrievances =
    activeTab === "All Grievances"
      ? grievances
      : grievances.filter(g => g.status === activeTab);

  return (
    <div className="admin-dashboard">
      <h2>
        {t("admin_dashboard")}
        {user?.city && <span className="city-badge"> · {user.city}</span>}
      </h2>

      {loading && <p className="loading-text">{t("loading")}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="status-cards">
            {STATUSES.map(status => (
              <div key={status} className={`card card-${status.toLowerCase().replace(/\s+/g, "-")}`}>
                <h3>{statusCounts[status]}</h3>
                <p>{t(`status_${status.replace(/\s+/g, "_").toLowerCase()}`)}</p>
              </div>
            ))}
          </div>

          {grievances.length === 0 ? (
            <div className="empty-admin-state">
              <p>{t("no_reports_in_city", { city: user?.city || "" })}</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="tabs">
                {["All Grievances", ...STATUSES].map(tab => (
                  <button
                    key={tab}
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "All Grievances" ? t("all_grievances") : t(`status_${tab.replace(/\s+/g, "_").toLowerCase()}`)}
                  </button>
                ))}
              </div>

              {/* Grievances Table (desktop) / Cards (mobile) */}
              <div className="grievance-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t("issue")}</th>
                      <th>{t("category")}</th>
                      <th>{t("location")}</th>
                      <th>{t("citizen")}</th>
                      <th>{t("status")}</th>
                      <th>{t("reported")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrievances.map((g) => {
                      const citizenName = g.user?.name || t("unknown");
                      const citizenEmail = g.user?.email || t("not_available");

                      return (
                        <tr key={g._id}>
                          <td>{`G-${g._id.slice(-4)}`}</td>
                          <td>
                            <strong>{g.title}</strong><br />
                            <small>{g.description?.slice(0, 50)}{g.description?.length > 50 ? "..." : ""}</small>
                          </td>
                          <td>{g.category || "—"}</td>
                          <td>{g.location || "—"}</td>
                          <td>
                            {citizenName}<br />
                            <small>{citizenEmail}</small>
                          </td>
                          <td>
                            <span className={`status-label ${g.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {t(`status_${g.status.replace(/\s+/g, "_").toLowerCase()}`)}
                            </span>
                          </td>
                          <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={() => navigate(`/admin-dashboard/report/${g._id}`)}
                            >
                              {t("view_details")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile card list — same data, touch-friendly */}
                <div className="grievance-cards">
                  {filteredGrievances.map((g) => (
                    <div key={g._id} className="grievance-card" onClick={() => navigate(`/admin-dashboard/report/${g._id}`)}>
                      <div className="grievance-card-top">
                        <strong>{g.title}</strong>
                        <span className={`status-label ${g.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {t(`status_${g.status.replace(/\s+/g, "_").toLowerCase()}`)}
                        </span>
                      </div>
                      <p className="grievance-card-desc">{g.description?.slice(0, 80)}</p>
                      <div className="grievance-card-meta">
                        <span>{g.category}</span>
                        <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Category Breakdown & Recent Activity */}
              <div className="dashboard-footer">
                <div className="category-breakdown">
                  <h4>{t("grievances_by_category")}</h4>
                  <ul>
                    {Object.entries(categoryCounts).map(([cat, count]) => (
                      <li key={cat}>{cat} — {count}</li>
                    ))}
                  </ul>
                </div>

                <div className="recent-activity">
                  <h4>{t("recent_activity")}</h4>
                  <ul>
                    {recentActivity.map((g) => (
                      <li key={g._id}>
                        <strong>{g.title}</strong><br />
                        <small>{`G-${g._id.slice(-4)} • ${new Date(g.createdAt).toLocaleString()}`}</small>
                        <span className={`status-label ${g.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {t(`status_${g.status.replace(/\s+/g, "_").toLowerCase()}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
