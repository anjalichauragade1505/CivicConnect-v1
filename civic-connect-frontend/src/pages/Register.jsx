import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../config/axiosInstance';
import { CITIES } from '../config/cities';
import './Register.css';

export default function Register() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      const msg = t('passwords_no_match');
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      const msg = t('password_rules_message');
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: fullName,
        email: email.trim(),
        phone,
        password,
        city: city || undefined,
      });

      setSuccess(t('register_success'));
      toast.success(t('register_success'));
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || t('register_failed');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="register-container">
        <div className="register-box">
          <h2 className="register-title">{t('create_account')}</h2>
          <p className="register-subtitle">{t('register_subtitle')}</p>

          {error && <p className="error-message" role="alert">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="reg-name">{t('full_name')}<span className="required">*</span></label>
            <input
              id="reg-name"
              type="text"
              placeholder={t('full_name_placeholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="reg-email">{t('email')}<span className="required">*</span></label>
            <input
              id="reg-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="reg-phone">{t('phone')}<span className="required">*</span></label>
            <input
              id="reg-phone"
              type="tel"
              placeholder={t('phone_placeholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
            />

            <label htmlFor="reg-city">{t('city')}</label>
            <select
              id="reg-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">{t('select_city_optional')}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label htmlFor="reg-password">{t('password')}<span className="required">*</span></label>
            <input
              id="reg-password"
              type="password"
              placeholder={t('password_create_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordRules(true)}
              onBlur={() => setShowPasswordRules(false)}
              autoComplete="new-password"
              required
            />
            {showPasswordRules && (
              <ul className="password-rules">
                <li className={/.{8,}/.test(password) ? 'valid' : ''}>
                  {t('rule_min_length')}
                </li>
                <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                  {t('rule_uppercase')}
                </li>
                <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                  {t('rule_lowercase')}
                </li>
                <li className={/\d/.test(password) ? 'valid' : ''}>
                  {t('rule_number')}
                </li>
                <li className={/[@$!%*?&]/.test(password) ? 'valid' : ''}>
                  {t('rule_special')}
                </li>
              </ul>
            )}

            <label htmlFor="reg-confirm">{t('confirm_password')}<span className="required">*</span></label>
            <input
              id="reg-confirm"
              type="password"
              placeholder={t('confirm_password_placeholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? t('creating_account') : t('create_account')}
            </button>
          </form>

          <p className="login-redirect">
            {t('have_account')}{' '}
            <Link to="/login" className="login-link">
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
