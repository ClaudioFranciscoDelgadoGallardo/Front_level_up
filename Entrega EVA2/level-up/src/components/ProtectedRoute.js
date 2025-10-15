import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Verificar si hay un usuario logueado
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  
  // Verificar si el usuario es administrador
  const esAdmin = usuarioActual && usuarioActual.rol === 'admin';

  if (!esAdmin) {
    // Si no es admin, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si es admin, mostrar el componente
  return children;
}
