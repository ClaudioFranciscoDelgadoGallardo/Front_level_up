import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../styles/Carrito.css';

export default function Carrito() {
  const { eliminarDelCarrito, actualizarCantidad, vaciarCarrito, calcularTotales } = useCarrito();
  const { items, subtotal, descuento, total } = calcularTotales();
  const [productosStock, setProductosStock] = useState([]);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductosStock(productos);
  }, []);
  const getStockDisponible = (codigo) => {
    const producto = productosStock.find(p => p.codigo === codigo);
    return producto ? producto.stock : 0;
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const handleCantidadChange = (codigo, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad);
    if (!isNaN(cantidad) && cantidad >= 0) {
      actualizarCantidad(codigo, cantidad);
    }
  };

  const handleFinalizarCompra = () => {
    if (items.length === 0) {
      if (window.notificar) {
        window.notificar('El carrito está vacío', 'error', 3000);
      }
      return;
    }
    
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    items.forEach(item => {
      const index = productos.findIndex(p => p.codigo === item.codigo);
      if (index !== -1 && productos[index].stock >= item.qty) {
        productos[index].stock -= item.qty;
      }
    });
    localStorage.setItem('productos', JSON.stringify(productos));
    
    vaciarCarrito();
    
    if (window.notificar) {
      window.notificar('¡Gracias por tu compra!', 'success', 3000);
    }
    vaciarCarrito();
    
    setTimeout(() => {
      window.location.href = '/productos';
    }, 2000);
  };

  return (
    <main className="container carrito-page">
      <h2 className="section-title">Carrito de Compras</h2>
      
      {items.length === 0 ? (
        <div className="carrito-vacio text-center py-5">
          <img 
            src="/assets/icons/carrito.png" 
            alt="Carrito vacío" 
            style={{ width: '100px', opacity: 0.3 }}
            className="mb-4"
          />
          <h3 className="text-secondary mb-4">No hay productos en el carrito</h3>
          <Link to="/productos" className="btn btn-success px-5">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <>
          <div className="carrito-items mb-4">
            {items.map((item) => (
              <div key={item.codigo} className="carrito-item-card mb-3">
                <div className="row align-items-center">
                  <div className="col-md-2 text-center">
                    <Link to={`/detalle/${item.codigo}`}>
                      <img 
                        src={item.imagen} 
                        alt={item.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px', objectFit: 'cover', cursor: 'pointer' }}
                      />
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link 
                      to={`/detalle/${item.codigo}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h5 className="mb-1" style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>
                        {item.nombre}
                      </h5>
                    </Link>
                    <p className="mb-0" style={{ color: 'var(--text-primary)' }}>{item.codigo}</p>
                    <small style={{ color: item.qty > getStockDisponible(item.codigo) ? '#ff4444' : 'var(--text-secondary)' }}>
                      Stock disponible: {getStockDisponible(item.codigo)}
                    </small>
                  </div>
                  <div className="col-md-2 text-center">
                    <p className="mb-0 fw-bold" style={{ color: 'var(--accent-blue)' }}>
                      {formatearPrecio(item.precio)}
                    </p>
                    <small style={{ color: 'var(--text-primary)' }}>c/u</small>
                  </div>
                  <div className="col-md-2">
                    <div className="cantidad-control d-flex align-items-center justify-content-center h-100">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => actualizarCantidad(item.codigo, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control form-control-sm mx-2 text-center"
                        style={{ width: '60px' }}
                        value={item.qty}
                        onChange={(e) => handleCantidadChange(item.codigo, e.target.value)}
                        min="1"
                        max={getStockDisponible(item.codigo)}
                      />
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => actualizarCantidad(item.codigo, item.qty + 1)}
                        disabled={item.qty >= getStockDisponible(item.codigo)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <p className="mb-0 fw-bold" style={{ color: 'var(--accent-green)', fontSize: '1.1rem' }}>
                        {formatearPrecio(item.subtotal)}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-1 text-center">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDelCarrito(item.codigo)}
                      title="Eliminar producto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <div className="row">
              <div className="col-md-8">
                <button 
                  className="btn btn-outline-danger"
                  onClick={vaciarCarrito}
                >
                  Vaciar Carrito
                </button>
                <Link 
                  to="/productos" 
                  className="btn btn-outline-secondary ms-3"
                >
                  Seguir Comprando
                </Link>
              </div>
              <div className="col-md-4">
                <div className="total-box p-4 rounded">
                  <h4 className="mb-3">Resumen de Compra</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatearPrecio(subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Descuento:</span>
                    <span className="text-success">-{formatearPrecio(descuento)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span className="text-success">Gratis</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <h5>Total:</h5>
                    <h5 style={{ color: 'var(--accent-green)' }}>
                      {formatearPrecio(total)}
                    </h5>
                  </div>
                  <button 
                    className="btn w-100"
                    style={{ 
                      backgroundColor: 'var(--accent-green)', 
                      color: '#000',
                      fontWeight: 'bold',
                      padding: '0.75rem'
                    }}
                    onClick={handleFinalizarCompra}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
