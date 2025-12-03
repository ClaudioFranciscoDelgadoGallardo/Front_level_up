import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  
  const esAdmin = usuarioActual && usuarioActual.rol === 'admin';

  if (!esAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
