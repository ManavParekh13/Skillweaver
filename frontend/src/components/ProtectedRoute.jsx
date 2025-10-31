// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { token } = useAuth(); // Get the token from our context

  // 1. Check if the user is logged in
  if (!token) {
    // 2. If not, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in, show the component (e.g., Dashboard or Profile)
  return <Outlet />;
}

export default ProtectedRoute;