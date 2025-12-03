import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/orderService';
import '../styles/MisOrdenes.css';

export default function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarOrdenes();
    
    // Recargar órdenes cada 30 segundos para ver cambios de estado
    const intervalo = setInterval(() => {
      cargarOrdenes();
    }, 30000); // 30 segundos

    return () => clearInterval(intervalo);
  }, []);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      // Ordenar por fecha más reciente primero
      const ordenesOrdenadas = data.sort((a, b) => 
        new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
      setOrdenes(ordenesOrdenadas);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatearPrecio = (precio) => {
    if (precio === undefined || precio === null || isNaN(precio)) {
      return '$0';
    }
    return `$${Math.round(Number(precio)).toLocaleString('es-CL')}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerEstadoBadge = (status) => {
    const badges = {
      PENDIENTE: { class: 'badge-warning', text: 'Pendiente' },
      PROCESANDO: { class: 'badge-info', text: 'Procesando' },
      ENVIADO: { class: 'badge-primary', text: 'Enviado' },
      ENTREGADO: { class: 'badge-success', text: 'Entregado' },
      CANCELADO: { class: 'badge-danger', text: 'Cancelado' }
    };
    return badges[status] || { class: 'badge-secondary', text: status };
  };

  if (loading) {
    return (
      <main className="container mis-ordenes-page">
        <h2 className="section-title">Mis Órdenes</h2>
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando órdenes...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mis-ordenes-page">
        <h2 className="section-title">Mis Órdenes</h2>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar órdenes</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-danger" onClick={cargarOrdenes}>
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mis-ordenes-page">
      <h2 className="section-title mb-4">Mis Órdenes</h2>

      {ordenes.length === 0 ? (
        <div className="text-center py-5">
          <img 
            src="/assets/icons/carrito.png" 
            alt="Sin órdenes" 
            className="mb-4"
            style={{ width: '100px', opacity: 0.5 }}
          />
          <h3 className="text-secondary mb-4">No tienes órdenes todavía</h3>
          <Link to="/productos" className="btn btn-success px-5">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <div className="ordenes-list">
          {ordenes.map((orden) => {
            const badge = obtenerEstadoBadge(orden.estado);
            return (
              <div key={orden.id} className="orden-card mb-4">
                <div className="orden-header">
                  <div className="orden-info">
                    <h5 className="orden-id">ORDEN #{orden.numeroOrden || orden.id}</h5>
                    <p className="orden-fecha mb-0">
                      {formatearFecha(orden.fechaCreacion)}
                    </p>
                  </div>
                  <div className="orden-estado">
                    <span className={`badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                <div className="orden-body">
                  <div className="orden-items">
                    <h6 className="mb-3">PRODUCTOS:</h6>
                    {orden.detalles && orden.detalles.map((detalle, index) => (
                      <div key={index} className="orden-item mb-2">
                        <div className="d-flex justify-content-between">
                          <span>
                            {detalle.productoNombre || detalle.nombreProducto || 'Producto'}
                            <small className="text-muted ms-2">x{detalle.cantidad}</small>
                          </span>
                          <span className="fw-bold">
                            {formatearPrecio(detalle.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="orden-divider" />

                  <div className="orden-totales">
                    {orden.subtotal && (
                      <div className="d-flex justify-content-between mb-1">
                        <span>Subtotal:</span>
                        <span>{formatearPrecio(orden.subtotal)}</span>
                      </div>
                    )}
                    {orden.iva && orden.iva > 0 && (
                      <div className="d-flex justify-content-between mb-1">
                        <span>IVA incluido (19%):</span>
                        <span>{formatearPrecio(orden.iva)}</span>
                      </div>
                    )}
                    {orden.descuentoTotal > 0 && (
                      <div className="d-flex justify-content-between mb-1">
                        <span>Descuento:</span>
                        <span className="text-success">
                          -{formatearPrecio(orden.descuentoTotal)}
                        </span>
                      </div>
                    )}
                    {orden.envio > 0 && (
                      <div className="d-flex justify-content-between mb-1">
                        <span>Envío:</span>
                        <span>{formatearPrecio(orden.envio)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-2 mt-2">
                      <strong>TOTAL:</strong>
                      <strong className="orden-total">
                        {formatearPrecio(orden.total)}
                      </strong>
                    </div>
                  </div>

                  {orden.direccionEnvio && (
                    <div className="orden-envio mt-3">
                      <small>
                        <strong>Dirección:</strong> {orden.direccionEnvio}
                        {orden.comunaEnvio && `, ${orden.comunaEnvio}`}
                        {orden.ciudadEnvio && `, ${orden.ciudadEnvio}`}
                      </small>
                    </div>
                  )}

                  {orden.metodoPago && (
                    <div className="orden-pago">
                      <small>
                        <strong>Método de pago:</strong> {orden.metodoPago}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
