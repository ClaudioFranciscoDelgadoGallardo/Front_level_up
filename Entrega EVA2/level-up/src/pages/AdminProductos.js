import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    const productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(productosLS);
  };

  const eliminarProducto = (codigo) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto ${codigo}?`)) {
      const productosActualizados = productos.filter(p => p.codigo !== codigo);
      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      setProductos(productosActualizados);
      if (window.notificar) {
        window.notificar('Producto eliminado exitosamente', 'success', 3000);
      }
    }
  };

  const editarProducto = (codigo) => {
    navigate(`/admin/productos/editar/${codigo}`);
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="container admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Gestión de Productos</h2>
          <Link to="/admin" className="text-secondary">
            ← Volver al Panel
          </Link>
        </div>
        <Link to="/admin/productos/nuevo" className="btn btn-success">
          + Nuevo Producto
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, código o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            background: '#111',
            border: '1px solid #333',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary mb-4">No hay productos registrados</p>
          <Link to="/admin/productos/nuevo" className="btn btn-success">
            Agregar Primer Producto
          </Link>
        </div>
      ) : (
        <div className="admin-table">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.codigo}>
                  <td>
                    <img 
                      src={producto.imagen || '/assets/icons/icono.png'} 
                      alt={producto.nombre}
                      width="50"
                      height="50"
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'var(--accent-blue)' }}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-green)' }}>
                    ${producto.precio.toLocaleString('es-CL')}
                  </td>
                  <td>
                    <span className={producto.stock < 5 ? 'text-danger' : 'text-success'}>
                      {producto.stock}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success btn-action"
                      onClick={() => editarProducto(producto.codigo)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger btn-action"
                      onClick={() => eliminarProducto(producto.codigo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {productosFiltrados.length === 0 && productos.length > 0 && (
        <div className="text-center py-4">
          <p className="text-secondary">No se encontraron productos con "{busqueda}"</p>
        </div>
      )}
    </main>
  );
}
