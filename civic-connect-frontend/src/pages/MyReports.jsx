import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../config/axiosInstance';
import './MyReports.css';

const STATUS_CLASS = {
  Pending: 'status-pending',
  'In Progress': 'status-inprogress',
  Resolved: 'status-resolved',
  Rejected: 'status-rejected',
};

export default function MyReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/my-reports');
        setReports(res.data);
      } catch (err) {
        setError(err.response?.data?.message || t('fetch_reports_failed'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [t]);

  return (
    <div className="page-bg">
      <div className="reports-container">
        <h2 className="reports-heading">📋 {t('my_reports')}</h2>

        {loading && <p className="loading-text">{t('loading')}</p>}
        {!loading && error && <p className="error-message" role="alert">{error}</p>}

        {!loading && !error && reports.length === 0 && (
          <div className="empty-state">
            <p className="no-report">{t('no_reports_yet')}</p>
            <Link to="/create-report" className="empty-cta">
              {t('report_an_issue')}
            </Link>
          </div>
        )}

        {!loading && reports.map((report) => (
          <div key={report._id} className="report-card">
            <div className="report-card-header">
              <h3 className="report-title">{report.title}</h3>
              <span className={`status-badge ${STATUS_CLASS[report.status] || ''}`}>
                {t(`status_${report.status.replace(/\s+/g, '_').toLowerCase()}`)}
              </span>
            </div>
            <p className="report-description">{report.description}</p>
            {report.image && (
              <img
                src={`data:image/jpeg;base64,${report.image}`}
                alt={report.title}
                className="report-image"
                loading="lazy"
              />
            )}
            <p className="report-meta">
              <strong>{t('city')}:</strong> {report.city || '—'} &nbsp;•&nbsp;
              <strong>{t('category')}:</strong> {report.category || '—'}
            </p>
            <p className="report-date">
              {t('created_at')}: {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
