import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import logo from "../assets/civic-logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleLanguage = () => {
    const next = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(next);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <img src={logo} alt="Civic Connect Logo" className="logo" />
        <div className="brand-text">
          <h1>Civic Connect</h1>
          <p className="tagline">{t("tagline")}</p>
        </div>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={t("toggle_menu")}
      >
        ☰
      </button>

      <nav className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {isAuthenticated && isAdmin ? (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
              {t("dashboard")}
            </NavLink>
            <button className="lang-toggle" onClick={toggleLanguage}>
              {i18n.language === "hi" ? "EN" : "हिं"}
            </button>
            <button className="sign-in-button" onClick={handleLogout}>{t("logout")}</button>
          </>
        ) : (
          <>
            <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
              {t("dashboard")}
            </NavLink>
            <NavLink to="/create-report" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
              {t("report_issue")}
            </NavLink>
            <NavLink to="/my-reports" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
              {t("progress")}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
              {t("about")}
            </NavLink>
            <button className="lang-toggle" onClick={toggleLanguage}>
              {i18n.language === "hi" ? "EN" : "हिं"}
            </button>
            {isAuthenticated ? (
              <button className="sign-in-button" onClick={handleLogout}>{t("logout")}</button>
            ) : (
              <NavLink to="/login" className="sign-in-button" onClick={() => setMenuOpen(false)}>{t("sign_in")}</NavLink>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
