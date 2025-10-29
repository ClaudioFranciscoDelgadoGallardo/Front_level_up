import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { registrarLogUsuario } from '../utils/logManager';
import '../styles/Header.css';

export default function Header() {
  const [showCarrito, setShowCarrito] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
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
    
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    let stockInsuficiente = false;
    
    items.forEach(item => {
      const producto = productos.find(p => p.codigo === item.codigo);
      if (producto && producto.stock < item.qty) {
        stockInsuficiente = true;
        if (window.notificar) {
          window.notificar(`Stock insuficiente para ${producto.nombre}`, 'error', 3000);
        }
      }
    });
    
    if (stockInsuficiente) {
      return;
    }
    
    items.forEach(item => {
      const index = productos.findIndex(p => p.codigo === item.codigo);
      if (index !== -1) {
        productos[index].stock -= item.qty;
        productos[index].fechaModificacion = new Date().toISOString();
      }
    });
    
    localStorage.setItem('productos', JSON.stringify(productos));
    window.dispatchEvent(new Event('storage'));
    
    const productosComprados = items.map(item => `${item.nombre} (x${item.qty})`).join(', ');
    registrarLogUsuario(`Realizó compra: ${productosComprados} - Total: $${total.toLocaleString('es-CL')}`);
    
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
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container header-content">
            <Link to={isAdminRoute ? "/admin" : "/"} className="navbar-brand logo d-flex align-items-center">
              <img src="/assets/icons/icono.png" alt="Level Up" width="56" height="56" className="me-2" />
              <span className="d-none d-sm-inline">LEVEL-UP GAMER</span>
              <span className="d-inline d-sm-none">LEVEL-UP</span>
            </Link>
            
            {!isAdminRoute && (
              <div className="d-flex align-items-center order-lg-3 ms-auto">
                <button 
                  className="me-2 d-flex align-items-center bg-transparent border-0 position-relative" 
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

            <button 
              className="navbar-toggler ms-2" 
              type="button" 
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-controls="navbarNav" 
              aria-expanded={menuAbierto} 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="navbarNav">
              {isAdminRoute ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/admin" className="nav-link" onClick={() => setMenuAbierto(false)}>Dashboard</Link></li>
                  <li className="nav-item"><Link to="/admin/productos" className="nav-link" onClick={() => setMenuAbierto(false)}>Productos</Link></li>
                  <li className="nav-item"><Link to="/admin/destacados" className="nav-link" onClick={() => setMenuAbierto(false)}>Destacados</Link></li>
                  <li className="nav-item"><Link to="/admin/usuarios" className="nav-link" onClick={() => setMenuAbierto(false)}>Usuarios</Link></li>
                  <li className="nav-item"><Link to="/admin/logs" className="nav-link" onClick={() => setMenuAbierto(false)}>Logs</Link></li>
                  <li className="nav-item mt-2 mt-lg-0">
                    <button 
                      onClick={() => { handleCerrarSesion(); setMenuAbierto(false); }}
                      className="btn btn-danger btn-sm w-100"
                      style={{ padding: '0.25rem 0.75rem', fontWeight: 'bold' }}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/" className="nav-link" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
                  <li className="nav-item"><Link to="/productos" className="nav-link" onClick={() => setMenuAbierto(false)}>Productos</Link></li>
                  <li className="nav-item"><Link to="/noticias" className="nav-link" onClick={() => setMenuAbierto(false)}>Noticias</Link></li>
                  <li className="nav-item"><Link to="/nosotros" className="nav-link" onClick={() => setMenuAbierto(false)}>Nosotros</Link></li>
                  <li className="nav-item"><Link to="/contacto" className="nav-link" onClick={() => setMenuAbierto(false)}>Contacto</Link></li>
                  <li className="nav-item"><Link to="/registro" className="nav-link" onClick={() => setMenuAbierto(false)}>Registro</Link></li>
                  <li className="nav-item"><Link to="/login" className="nav-link" onClick={() => setMenuAbierto(false)}>Login</Link></li>
                </ul>
              )}
            </div>
          </div>
        </nav>
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
                      <Link 
                        to={`/detalle/${item.codigo}`}
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                        onClick={() => setShowCarrito(false)}
                      >
                        <span>
                          {item.nombre} 
                          <span className="badge bg-secondary ms-2">x{item.qty}</span>
                        </span>
                      </Link>
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
