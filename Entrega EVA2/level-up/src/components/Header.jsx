import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { registrarLogUsuario } from '../utils/logManager';
import '../styles/Header.css';

export default function Header() {
  const [showCarrito, setShowCarrito] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
          <div className="container">
            <Link to={isAdminRoute ? "/admin" : "/"} className="navbar-brand d-flex align-items-center">
              <img src="/assets/icons/icono.png" alt="Level Up" width="50" height="50" className="me-2" />
              <span className="fw-bold">LEVEL-UP GAMER</span>
            </Link>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              {isAdminRoute ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/admin" className="nav-link">Dashboard</Link></li>
                  <li className="nav-item"><Link to="/admin/productos" className="nav-link">Productos</Link></li>
                  <li className="nav-item"><Link to="/admin/destacados" className="nav-link">Destacados</Link></li>
                  <li className="nav-item"><Link to="/admin/usuarios" className="nav-link">Usuarios</Link></li>
                  <li className="nav-item"><Link to="/admin/logs" className="nav-link">Logs</Link></li>
                  <li className="nav-item">
                    <button 
                      onClick={handleCerrarSesion}
                      className="btn btn-danger btn-sm ms-2"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              ) : (
                <>
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item"><Link to="/" className="nav-link">Inicio</Link></li>
                    <li className="nav-item"><Link to="/productos" className="nav-link">Productos</Link></li>
                    <li className="nav-item"><Link to="/noticias" className="nav-link">Noticias</Link></li>
                    <li className="nav-item"><Link to="/nosotros" className="nav-link">Nosotros</Link></li>
                    <li className="nav-item"><Link to="/contacto" className="nav-link">Contacto</Link></li>
                    <li className="nav-item"><Link to="/registro" className="nav-link">Registro</Link></li>
                    <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
                  </ul>
                  <button 
                    className="btn btn-link position-relative ms-3" 
                    onClick={() => setShowCarrito(!showCarrito)}
                  >
                    <img src="/assets/icons/carrito.png" alt="Carrito" width="32" height="32" />
                    {obtenerCantidadTotal() > 0 && (
                      <span 
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                      >
                        {obtenerCantidadTotal()}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {showCarrito && (
        <div id="carrito-dropdown" className="carrito-dropdown shadow-lg">
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
                    <li key={item.codigo} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center carrito-dropdown-item">
                      <Link 
                        to={`/detalle/${item.codigo}`}
                        className="carrito-dropdown-link"
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
                  <span className="fw-bold carrito-dropdown-total">
                    ${total.toLocaleString('es-CL')}
                  </span>
                </div>
                <button 
                  className="btn w-100 mb-2 carrito-dropdown-btn"
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
