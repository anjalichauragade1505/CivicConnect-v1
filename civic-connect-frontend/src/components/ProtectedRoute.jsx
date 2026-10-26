import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // A citizen tried to reach an admin-only page directly — send them
    // somewhere useful instead of a blank/broken page.
    return <Navigate to="/create-report" replace />;
  }

  if (!adminOnly && isAdmin) {
    // Keep admins inside the admin area for a focused experience.
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}
