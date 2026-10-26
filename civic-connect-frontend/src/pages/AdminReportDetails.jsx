import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../config/axiosInstance";
import "./AdminReportDetails.css";

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const AdminReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/admin/reports/${id}`);
        setReport(res.data);
        setUpdatedStatus(res.data.status);
      } catch (err) {
        setError(err.response?.data?.message || t("fetch_report_failed"));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, t]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/admin/reports/${id}/status`, { status: updatedStatus });
      setReport((prev) => ({ ...prev, status: updatedStatus }));
      toast.success(t("status_update_success"));
    } catch (err) {
      toast.error(err.response?.data?.message || t("status_update_failed"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error" role="alert">{error}</div>;
  if (!report) return <div className="error">{t("report_not_found")}</div>;

  return (
    <div className="admin-report-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← {t("back_to_dashboard")}
      </button>

      <h2>{report.title}</h2>
      <p className="submitted-date">
        🕓 {t("submitted_on")} {new Date(report.createdAt).toLocaleDateString()}
      </p>

      <div className="report-details-container">
        <div className="details-box">
          <h3>{t("details")}</h3>
          <p>{report.description}</p>

          <h4>{t("image")}</h4>
          {report?.image && (
            <img
              src={
                report.image.startsWith("data:image/")
                  ? report.image
                  : `data:image/jpeg;base64,${report.image}`
              }
              alt={report.title}
              className="report-detail-image"
            />
          )}

          <div className="info-grid">
            <p><strong>{t("category")}:</strong> {report.category}</p>
            <p><strong>{t("location")}:</strong> {report.location}</p>
            {report.landmark && <p><strong>{t("landmark")}:</strong> {report.landmark}</p>}
            <p><strong>{t("city")}:</strong> {report.city}</p>
            <p><strong>{t("citizen")}:</strong> {report.user?.name} ({report.user?.email})</p>
          </div>
        </div>

        <div className="status-timeline-box">
          <h3>{t("status_timeline")}</h3>
          <ul className="status-timeline">
            {STATUSES.map((s) => (
              <li key={s} className={report.status === s ? "active" : ""}>
                {t(`status_${s.replace(/\s+/g, "_").toLowerCase()}`)}
              </li>
            ))}
          </ul>

          <div className="status-update-section">
            <h3>{t("change_status")}</h3>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="status-select"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`status_${s.replace(/\s+/g, "_").toLowerCase()}`)}
                </option>
              ))}
            </select>
            <button
              className="update-status-btn"
              onClick={handleStatusUpdate}
              disabled={updating || updatedStatus === report.status}
            >
              {updating ? t("updating") : t("update_status")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportDetails;
