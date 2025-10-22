import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../styles/Header.css';

export default function Header() {
  const [showCarrito, setShowCarrito] = useState(false);
  const { eliminarDelCarrito, calcularTotales, obtenerCantidadTotal, vaciarCarrito } = useCarrito();
  const { items, subtotal, descuento, total } = calcularTotales();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const handlePagar = () => {
    if (items.length === 0) {
      if (window.notificar) {
        window.notificar('El carrito está vacío', 'error', 3000);
      }
      return;
    }
    if (window.notificar) {
      window.notificar('¡Gracias por tu compra!', 'success', 3000);
    }
    vaciarCarrito();
    setShowCarrito(false);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    if (window.notificar) {
      window.notificar('Sesión cerrada exitosamente', 'success', 3000);
    }
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className="container header-content">
          <Link to={isAdminRoute ? "/admin" : "/"} className="logo d-flex align-items-center">
            <img src="/assets/icons/icono.png" alt="Level Up" width="56" height="56" className="me-2" />
            LEVEL-UP GAMER
          </Link>
          
          {isAdminRoute ? (
            <ul className="nav-menu">
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin/productos">Productos</Link></li>
              <li><Link to="/admin/usuarios">Usuarios</Link></li>
              <li>
                <button 
                  onClick={handleCerrarSesion}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.25rem 0.75rem', fontWeight: 'bold' }}
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          ) : (
            <ul className="nav-menu">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/registro">Registro</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          )}
          
          {!isAdminRoute && (
            <div className="d-flex align-items-center ms-auto">
              <button 
                className="me-3 d-flex align-items-center bg-transparent border-0 position-relative" 
                title="Carrito"
                onClick={() => setShowCarrito(!showCarrito)}
                style={{ cursor: 'pointer' }}
              >
                <img src="/assets/icons/carrito.png" alt="Carrito" width="32" height="32" id="carrito-icon" />
                {obtenerCantidadTotal() > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ 
                      backgroundColor: 'var(--accent-green)', 
                      color: '#000',
                      fontSize: '0.65rem',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    {obtenerCantidadTotal()}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {showCarrito && (
        <div 
          id="carrito-dropdown" 
          className="carrito-dropdown shadow-lg" 
          style={{
            display: 'block', 
            position: 'fixed', 
            right: '2rem', 
            top: '4.5rem', 
            minWidth: '320px', 
            maxWidth: '400px',
            background: '#222', 
            borderRadius: '10px', 
            zIndex: 1000,
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          <div className="carrito-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <span className="fw-bold text-white">Carrito de compras</span>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              aria-label="Cerrar" 
              onClick={() => setShowCarrito(false)}
            ></button>
          </div>
          <div className="carrito-body p-3" id="carrito-body">
            {items.length === 0 ? (
              <p className="text-center text-muted mb-0">No hay productos en el carrito</p>
            ) : (
              <>
                <ul className="list-group mb-2">
                  {items.map(item => (
                    <li key={item.codigo} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center" style={{ fontSize: '0.9rem' }}>
                      <span>
                        {item.nombre} 
                        <span className="badge bg-secondary ms-2">x{item.qty}</span>
                      </span>
                      <span>{formatearPrecio(item.subtotal)}</span>
                      <button 
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => eliminarDelCarrito(item.codigo)}
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between align-items-center mb-1 text-white">
                  <span>Subtotal:</span>
                  <span>{formatearPrecio(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1 text-white">
                  <span>Descuento:</span>
                  <span>-{formatearPrecio(descuento)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-white">Total:</span>
                  <span className="fw-bold" style={{ color: 'var(--accent-green)', fontSize: '1.1rem' }}>
                    {formatearPrecio(total)}
                  </span>
                </div>
                <button 
                  className="btn w-100 mb-2"
                  style={{ 
                    backgroundColor: 'var(--accent-green)', 
                    color: '#000',
                    fontWeight: 'bold'
                  }}
                  onClick={handlePagar}
                >
                  Pagar
                </button>
                <Link 
                  to="/carrito" 
                  className="btn btn-outline-light w-100"
                  onClick={() => setShowCarrito(false)}
                >
                  Ver Carrito Completo
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
