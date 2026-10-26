import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../config/axiosInstance';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
        loginAs: role,
      });

      const { token, user } = res.data;
      login(token, user);
      toast.success(t('login_success', { name: user.name }));

      navigate(user.role === 'admin' ? '/admin-dashboard' : '/create-report');
    } catch (err) {
      const message = err.response?.data?.message || t('login_failed');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">{t('sign_in')}</h2>
          <p className="login-subtitle">{t('sign_in_subtitle')}</p>

          {error && <p className="error-message" role="alert">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">
              {t('email')}<span className="required">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">
              {t('password')}<span className="required">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              placeholder={t('password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <label htmlFor="login-role">
              {t('login_as')}<span className="required">*</span>
            </label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="citizen">{t('citizen')}</option>
              <option value="admin">{t('admin')}</option>
            </select>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? t('signing_in') : t('sign_in')}
            </button>
          </form>

          {role === 'citizen' && (
            <p className="signup-text">
              {t('no_account')}{' '}
              <Link to="/register" className="signup-link">
                {t('create_one')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
