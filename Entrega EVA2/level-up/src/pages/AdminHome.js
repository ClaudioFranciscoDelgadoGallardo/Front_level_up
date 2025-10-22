import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminHome() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    productosDestacados: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    setUsuarioActual(usuario);

    // Cargar estadísticas
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    setStats({
      totalProductos: productos.length,
      totalUsuarios: usuarios.length,
      productosDestacados: productos.slice(0, 3)
    });
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <main className="container admin-page">
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Panel de Administración</h2>
          <p style={{ color: '#fff' }}>
            Bienvenido, <span style={{ color: 'var(--accent-green)' }}>{usuarioActual?.nombre || 'Admin'}</span>
          </p>
        </div>
        <button 
          className="btn btn-outline-danger"
          onClick={handleCerrarSesion}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="stat-card">
            <div className="stat-icon">
              <img src="/assets/icons/icono.png" alt="Productos" width="40" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProductos}</h3>
              <p>Total Productos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsuarios}</h3>
              <p>Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{stats.productosDestacados.length}</h3>
              <p>Productos Destacados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>Gestión de Productos</h4>
            </div>
            <div className="admin-card-body">
              <p style={{ color: '#fff' }} className="mb-4">Administra el catálogo de productos de la tienda</p>
              <div className="d-flex gap-3">
                <Link to="/admin/productos" className="btn btn-success flex-grow-1">
                  Ver Productos
                </Link>
                <Link to="/admin/productos/nuevo" className="btn btn-success flex-grow-1">
                  Agregar Producto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>Gestión de Usuarios</h4>
            </div>
            <div className="admin-card-body">
              <p style={{ color: '#fff' }} className="mb-4">Administra los usuarios registrados en el sistema</p>
              <div className="d-flex gap-3">
                <Link to="/admin/usuarios" className="btn btn-success flex-grow-1">
                  Ver Usuarios
                </Link>
                <Link to="/admin/usuarios/nuevo" className="btn btn-success flex-grow-1">
                  Agregar Usuario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.productosDestacados.length > 0 && (
        <div className="productos-destacados">
          <h4 className="mb-3">Productos Recientes</h4>
          <div className="row">
            {stats.productosDestacados.map((producto) => (
              <div key={producto.codigo} className="col-md-4 mb-3">
                <div className="producto-mini-card">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="img-fluid rounded mb-2"
                  />
                  <h6>{producto.nombre}</h6>
                  <p style={{ color: 'var(--accent-green)' }} className="mb-0">{producto.categoria}</p>
                  <p className="fw-bold" style={{ color: 'var(--accent-green)' }}>
                    ${producto.precio.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
