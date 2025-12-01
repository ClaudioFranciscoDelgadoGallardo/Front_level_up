import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { registrarLogUsuario } from '../utils/logManager';
import { createOrder } from '../services/orderService';
import { obtenerProductoPorCodigo } from '../services/productService';
import '../styles/Header.css';

export default function Header() {
  const [showCarrito, setShowCarrito] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const { eliminarDelCarrito, calcularTotales, obtenerCantidadTotal, vaciarCarrito } = useCarrito();
  const { items, subtotal, descuento, total } = calcularTotales();
  const location = useLocation();
  
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const rolNormalizado = usuarioActual?.rol ? usuarioActual.rol.toUpperCase() : '';
  const isClienteRole = rolNormalizado === 'CLIENTE' || rolNormalizado === 'USUARIO';
  const isVendedorRole = rolNormalizado === 'VENDEDOR';
  const isAdminRole = rolNormalizado === 'ADMIN';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVendedorRoute = location.pathname.startsWith('/vendedor');

  const handleLinkClick = () => {
    // Cerrar el menú móvil
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
    // Recargar la página después de un breve delay para asegurar navegación
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const handlePagar = async () => {
    if (items.length === 0) {
      if (window.notificar) {
        window.notificar('El carrito está vacío', 'error', 3000);
      }
      return;
    }

    if (procesandoPago) {
      return; // Evitar múltiples clics
    }

    setProcesandoPago(true);

    try {
      // Obtener información del usuario
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
      if (!usuarioActual || !usuarioActual.id) {
        if (window.notificar) {
          window.notificar('Debes iniciar sesión para realizar una compra', 'error', 3000);
        }
        return;
      }

      // Obtener IDs de productos desde la API para items que no lo tengan
      const detallesConId = await Promise.all(
        items.map(async (item) => {
          let productoId = item.id;
          
          // Si el item no tiene ID, buscarlo desde la API por código
          if (!productoId) {
            try {
              console.log(`Buscando ID para producto ${item.codigo}...`);
              const producto = await obtenerProductoPorCodigo(item.codigo);
              console.log(`Producto encontrado:`, producto);
              productoId = producto.id;
            } catch (error) {
              console.error(`Error al obtener ID del producto ${item.codigo}:`, error);
              throw new Error(`No se pudo obtener el ID del producto ${item.codigo}`);
            }
          }
          
          if (!productoId) {
            throw new Error(`El producto ${item.nombre} no tiene ID`);
          }
          
          return {
            productoId: productoId,
            productoCodigo: item.codigo,
            productoNombre: item.nombre,
            cantidad: item.qty,
            precioUnitario: item.precio
          };
        })
      );
      
      // Verificar que todos los detalles tengan ID
      console.log('Detalles con ID:', detallesConId);
      
      // Preparar datos de la orden
      const orderData = {
        usuarioId: usuarioActual.id,
        usuarioNombre: usuarioActual.nombre || 'Usuario',
        usuarioCorreo: usuarioActual.correo || '',
        direccionEnvio: usuarioActual.direccion || 'Dirección no especificada',
        metodoPago: 'Transferencia',
        detalles: detallesConId
      };

      // Crear la orden (el trigger de la BD actualiza el stock automáticamente)
      const ordenCreada = await createOrder(orderData);

      // Progresión automática desactivada - ahora se maneja con trigger en Supabase
      // iniciarProgresionAutomatica(ordenCreada.id, (ordenActualizada) => {
      //   console.log(`Orden ${ordenActualizada.id} progresó a estado: ${ordenActualizada.estado}`);
      // });

      // Registrar log
      const productosComprados = items.map(item => `${item.nombre} (x${item.qty})`).join(', ');
      registrarLogUsuario(`Realizó compra: ${productosComprados} - Total: $${total.toLocaleString('es-CL')} - Orden: ${ordenCreada.id}`);

      // Notificar éxito
      if (window.notificar) {
        window.notificar(`¡Compra realizada con éxito! Orden #${ordenCreada.id}. El estado se actualizará automáticamente.`, 'success', 5000);
      }

      // Limpiar carrito y cerrar
      vaciarCarrito();
      setShowCarrito(false);

    } catch (error) {
      console.error('Error al procesar la compra:', error);
      
      let mensajeError = 'Error al procesar la compra. Intenta nuevamente.';
      
      // Detectar error de stock insuficiente
      if (error.message && error.message.includes('productos_stock_actual_check')) {
        mensajeError = 'Stock insuficiente. No hay suficientes unidades disponibles para completar tu compra.';
      } else if (error.message && error.message.includes('stock')) {
        mensajeError = 'Stock insuficiente para uno o más productos en tu carrito.';
      }
      
      if (window.notificar) {
        window.notificar(mensajeError, 'error', 5000);
      }
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <Link 
              to={isAdminRoute ? "/admin" : isVendedorRoute ? "/vendedor" : "/"} 
              className="navbar-brand d-flex align-items-center"
            >
              <img src="/assets/icons/icono.png" alt="Level Up" width="50" height="50" className="me-2" />
              <span className="fw-bold">LEVEL-UP</span>
            </Link>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              {isAdminRole && isAdminRoute ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/admin" className="nav-link">Dashboard</Link></li>
                  <li className="nav-item"><Link to="/admin/productos" className="nav-link">Productos</Link></li>
                  <li className="nav-item"><Link to="/admin/destacados" className="nav-link">Destacados</Link></li>
                  <li className="nav-item"><Link to="/admin/usuarios" className="nav-link">Usuarios</Link></li>
                  <li className="nav-item"><Link to="/admin/logs" className="nav-link">Logs</Link></li>
                </ul>
              ) : isVendedorRole && isVendedorRoute ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/vendedor" className="nav-link">Dashboard</Link></li>
                  <li className="nav-item"><Link to="/vendedor/productos" className="nav-link">Productos</Link></li>
                  <li className="nav-item"><Link to="/vendedor/destacados" className="nav-link">Destacados</Link></li>
                  <li className="nav-item"><Link to="/vendedor/perfil" className="nav-link">Mi Perfil</Link></li>
                </ul>
              ) : isClienteRole ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/" className="nav-link" onClick={handleLinkClick}>Inicio</Link></li>
                  <li className="nav-item"><Link to="/productos" className="nav-link" onClick={handleLinkClick}>Productos</Link></li>
                  <li className="nav-item"><Link to="/noticias" className="nav-link" onClick={handleLinkClick}>Noticias</Link></li>
                  <li className="nav-item"><Link to="/nosotros" className="nav-link" onClick={handleLinkClick}>Nosotros</Link></li>
                  <li className="nav-item"><Link to="/contacto" className="nav-link" onClick={handleLinkClick}>Contacto</Link></li>
                  <li className="nav-item"><Link to="/mis-ordenes" className="nav-link" onClick={handleLinkClick}>Mis Órdenes</Link></li>
                  <li className="nav-item"><Link to="/perfil" className="nav-link" onClick={handleLinkClick}>Mi Perfil</Link></li>
                </ul>
              ) : (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link to="/" className="nav-link" onClick={handleLinkClick}>Inicio</Link></li>
                  <li className="nav-item"><Link to="/productos" className="nav-link" onClick={handleLinkClick}>Productos</Link></li>
                  <li className="nav-item"><Link to="/noticias" className="nav-link" onClick={handleLinkClick}>Noticias</Link></li>
                  <li className="nav-item"><Link to="/nosotros" className="nav-link" onClick={handleLinkClick}>Nosotros</Link></li>
                  <li className="nav-item"><Link to="/contacto" className="nav-link" onClick={handleLinkClick}>Contacto</Link></li>
                  <li className="nav-item"><Link to="/registro" className="nav-link" onClick={handleLinkClick}>Registro</Link></li>
                  <li className="nav-item"><Link to="/login" className="nav-link" onClick={handleLinkClick}>Login</Link></li>
                </ul>
              )}
            </div>
            
            {(isClienteRole || !usuarioActual) && (
              <button 
                className="btn btn-link position-relative carrito-btn" 
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
            )}
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
                  disabled={procesandoPago}
                >
                  {procesandoPago ? 'Procesando...' : 'Pagar'}
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
