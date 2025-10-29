import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../styles/Detalle.css';

export default function Detalle() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const prod = productos.find(p => p.codigo === codigo);
    
    if (prod) {
      setProducto(prod);
    } else {
      if (window.notificar) {
        window.notificar('Producto no encontrado', 'error', 3000);
      }
      navigate('/productos');
    }
  }, [codigo, navigate]);

  const handleAgregarAlCarrito = () => {
    if (producto) {
      agregarAlCarrito(producto, cantidad);
      if (window.notificar) {
        window.notificar(`¡${cantidad} x ${producto.nombre} agregado al carrito!`, 'success', 3000);
      }
    }
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  if (!producto) {
    return (
      <main className="container" style={{ paddingTop: '6rem', minHeight: 'calc(100vh - 200px)' }}>
        <div className="text-center py-5">
          <p className="text-secondary">Cargando producto...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container detalle-page py-4">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: 'var(--accent-blue)' }}>Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/productos" style={{ color: 'var(--accent-blue)' }}>Productos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {producto.nombre}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-5 mb-4">
          <div className="detalle-imagen-container">
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="img-fluid rounded w-100"
              style={{ objectFit: 'contain', maxHeight: '500px' }}
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-7">
          <div className="detalle-info">
            <span 
              className="badge bg-secondary mb-3"
              style={{ 
                fontSize: '0.9rem',
                padding: '0.5rem 1rem'
              }}
            >
              {producto.categoria}
            </span>
            
            <h1 className="mb-3" style={{ color: 'var(--text-primary)' }}>
              {producto.nombre}
            </h1>

            <p className="mb-2" style={{ color: 'var(--accent-blue)', fontSize: '1.1rem', fontWeight: '500' }}>
              Código: {producto.codigo}
            </p>

            <div className="mb-4">
              <h2 style={{ color: 'var(--accent-green)', fontSize: '2.5rem' }}>
                {formatearPrecio(producto.precio)}
              </h2>
            </div>

            <div className="mb-4">
              <h5 style={{ color: 'var(--text-primary)' }}>Descripción</h5>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                {producto.descripcion || producto.desc || 'Sin descripción disponible.'}
              </p>
            </div>

            <div className="mb-4">
              <h5 style={{ color: 'var(--text-primary)' }}>Disponibilidad</h5>
              <p>
                <span 
                  className={producto.stock > 0 ? 'text-success' : 'text-danger'}
                  style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Agotado'}
                </span>
              </p>
            </div>

            {producto.stock > 0 && (
              <>
                <div className="mb-4">
                  <h5 style={{ color: 'var(--text-primary)' }}>Cantidad</h5>
                  <div className="cantidad-selector d-flex align-items-center">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="form-control mx-3 text-center"
                      style={{ 
                        width: '80px',
                        background: '#111',
                        border: '1px solid #333',
                        color: 'var(--text-primary)'
                      }}
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={producto.stock}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      disabled={cantidad >= producto.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button 
                    className="btn btn-success flex-grow-1"
                    style={{ padding: '0.75rem' }}
                    onClick={handleAgregarAlCarrito}
                  >
                    Agregar al Carrito
                  </button>
                  <Link 
                    to="/carrito"
                    className="btn btn-outline-success"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    Ir al Carrito
                  </Link>
                </div>
              </>
            )}

            {producto.stock === 0 && (
              <div className="alert alert-danger mt-3">
                Este producto está temporalmente agotado.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
