import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerProductos } from '../services/productService';
import '../styles/Admin.css';

export default function VendedorHome() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalDestacados: 0,
    productosConStock: 0,
    productosSinStock: 0,
    productosRecientes: []
  });
  const navigate = useNavigate();

  const cargarEstadisticas = async () => {
    try {
      console.log('🔄 Cargando estadísticas desde backend...');
      const productosBackend = await obtenerProductos();
      
      // Mapeo de IDs de categoría a nombres
      const categoriasMap = {
        1: 'Juegos de Mesa',
        2: 'Accesorios',
        3: 'Consolas',
        4: 'Videojuegos',
        5: 'Figuras',
        6: 'Otros'
      };

      const productosFormateados = productosBackend.map(p => ({
        ...p,
        codigo: p.codigo,
        nombre: p.nombre,
        categoria: categoriasMap[p.categoriaId] || 'Sin categoría',
        precio: p.precioVenta || p.precioBase || 0,
        stock: p.stockActual || 0,
        imagen: p.imagenPrincipal || '/assets/imgs/producto-default.png',
        destacado: p.destacado || false,
        fechaModificacion: p.fechaModificacion || p.fechaCreacion
      }));

      const productosConFecha = productosFormateados
        .filter(p => p.fechaModificacion)
        .sort((a, b) => new Date(b.fechaModificacion) - new Date(a.fechaModificacion));

      const productosDestacados = productosFormateados.filter(p => p.destacado);

      setStats({
        totalProductos: productosFormateados.length,
        totalDestacados: productosDestacados.length,
        productosConStock: productosFormateados.filter(p => p.stock > 0).length,
        productosSinStock: productosFormateados.filter(p => p.stock === 0).length,
        productosRecientes: productosConFecha.slice(0, 3)
      });

      console.log('✅ Estadísticas cargadas:', {
        total: productosFormateados.length,
        destacados: productosDestacados.length
      });
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      if (window.notificar) {
        window.notificar('Error al cargar estadísticas', 'error', 3000);
      }
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    setUsuarioActual(usuario);

    cargarEstadisticas();

    const handleStorageChange = () => {
      cargarEstadisticas();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('destacadosActualizados', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('destacadosActualizados', handleStorageChange);
    };
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <main className="container admin-page">
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Panel de Vendedor</h2>
          <p className="admin-home-bienvenida">
            Bienvenido, <span className="admin-home-nombre-usuario">{usuarioActual?.nombre || 'Vendedor'}</span>
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
        <div className="col-md-3 mb-3">
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
        <div className="col-md-3 mb-3">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{stats.totalDestacados}</h3>
              <p>Destacados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.productosConStock}</h3>
              <p>Con Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{stats.productosSinStock}</h3>
              <p>Sin Stock</p>
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
              <p className="admin-home-descripcion mb-4">Administra el catálogo de productos de la tienda</p>
              <div className="d-flex gap-3">
                <Link to="/vendedor/productos" className="btn btn-success flex-grow-1">
                  Ver Productos
                </Link>
                <Link to="/vendedor/productos/nuevo" className="btn btn-success flex-grow-1">
                  Agregar Producto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>Gestión de Destacados</h4>
            </div>
            <div className="admin-card-body">
              <p className="admin-home-descripcion mb-4">Administra los productos del carrusel de inicio</p>
              <div className="d-flex gap-3">
                <Link to="/vendedor/destacados" className="btn btn-success flex-grow-1">
                  Ver Destacados
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4>Mi Perfil</h4>
            </div>
            <div className="admin-card-body">
              <p className="admin-home-descripcion mb-4">Edita tu información personal y foto de perfil</p>
              <div className="d-flex gap-3">
                <Link to="/vendedor/perfil" className="btn btn-success flex-grow-1">
                  Ver Perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.productosRecientes.length > 0 && (
        <div className="productos-destacados">
          <h4 className="mb-3">Productos Recientes</h4>
          <div className="row">
            {stats.productosRecientes.map((producto) => (
              <div key={producto.codigo} className="col-md-4 mb-3">
                <div className="producto-mini-card">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="img-fluid rounded mb-2"
                  />
                  <h6>{producto.nombre}</h6>
                  <p className="mb-0">
                    <span className="badge bg-secondary">{producto.categoria}</span>
                  </p>
                  <p className="fw-bold admin-producto-precio">
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
