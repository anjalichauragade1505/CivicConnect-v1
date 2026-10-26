import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaUpload, FaTimes } from 'react-icons/fa';
import api from '../config/axiosInstance';
import { CITIES } from '../config/cities';
import './CreateReport.css';

export default function CreateReport() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [images, setImages] = useState([]); // single base64 image in array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t('image_too_large'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(t('image_only'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(',')[1];
      setImages([base64Image]);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const removeImage = () => setImages([]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('geolocation_unsupported'));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setLocating(false);
        toast.success(t('location_captured'));
      },
      () => {
        setLocating(false);
        toast.error(t('location_failed'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (images.length === 0) {
      const msg = t('image_required');
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!city) {
      const msg = t('city_required');
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reports/create', {
        title,
        description,
        category,
        location,
        landmark,
        city,
        image: images[0],
      });

      setSuccess(t('report_success'));
      toast.success(t('report_success'));
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
      setLandmark('');
      setCity('');
      setImages([]);
      setTimeout(() => navigate('/my-reports'), 1200);
    } catch (err) {
      const message = err.response?.data?.message || t('report_failed');
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="container">
        <h2 className="heading"><FaUpload className="icon" /> {t('report_an_issue')}</h2>
        <p className="subtext">{t('report_subtext')}</p>

        <form onSubmit={handleSubmit}>
          <label className="label">{t('issue_title')}</label>
          <input
            className="input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t('issue_title_placeholder')}
            required
          />

          <label className="label">{t('category')}</label>
          <select
            className="input"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">{t('select_category')}</option>
            <option value="Roads">{t('cat_roads')}</option>
            <option value="Water">{t('cat_water')}</option>
            <option value="Electricity">{t('cat_electricity')}</option>
            <option value="Sanitation">{t('cat_sanitation')}</option>
          </select>

          <label className="label">{t('city')}</label>
          <select
            className="input"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          >
            <option value="">{t('select_city')}</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="label">{t('description')}</label>
          <textarea
            className="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('description_placeholder')}
            required
          />

          <label className="label">{t('location_details')}</label>
          <div className="location-section">
            <FaMapMarkerAlt className="icon" />
            <input
              className="input"
              type="text"
              placeholder={t('location_placeholder')}
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
            <input
              className="input"
              type="text"
              placeholder={t('landmark_placeholder')}
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
            />
            <button
              type="button"
              className="location-btn"
              onClick={handleUseMyLocation}
              disabled={locating}
            >
              {locating ? t('locating') : t('use_my_location')}
            </button>
          </div>

          <label className="label">{t('upload_image')}</label>
          <label className="upload-box">
            <FaUpload size={30} />
            <p>{t('upload_click')}</p>
            <p className="small">{t('upload_hint')}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          {images.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p className="success">{t('image_selected')}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={`data:image/jpeg;base64,${images[0]}`}
                    alt={t('preview_alt')}
                    style={{
                      width: '150px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <FaTimes
                    title={t('remove')}
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      color: '#fff',
                      background: '#e74c3c',
                      borderRadius: '50%',
                      padding: '5px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {error && <p className="error" role="alert">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="buttons">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              {t('cancel')}
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? t('submitting') : t('submit_report')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
