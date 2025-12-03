import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  
  // Si no hay usuario, redirigir al login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especifican roles, solo verificar que esté autenticado
  if (allowedRoles.length === 0) {
    return children;
  }

  // Normalizar roles a mayúsculas para comparación
  const rolUsuario = usuarioActual.rol ? usuarioActual.rol.toUpperCase() : '';
  const rolesPermitidos = allowedRoles.map(r => r.toUpperCase());
  
  // Mapeo de roles legacy (usuario → CLIENTE)
  const rolMapeado = rolUsuario === 'USUARIO' ? 'CLIENTE' : rolUsuario;
  
  // Verificar si el usuario tiene uno de los roles permitidos
  const tienePermiso = rolesPermitidos.includes(rolMapeado) || 
                       rolesPermitidos.includes('USUARIO') && rolMapeado === 'CLIENTE';

  if (!tienePermiso) {
    console.log('Acceso denegado. Rol:', rolMapeado, 'Roles permitidos:', rolesPermitidos);
    return <Navigate to="/" replace />;
  }

  return children;
}
