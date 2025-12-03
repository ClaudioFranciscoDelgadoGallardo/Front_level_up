import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerProductos, desactivarProducto } from '../services/productService';
import { registrarLogAdmin } from '../utils/logManager';
import ModalConfirmacion from '../components/ModalConfirmacion';
import '../styles/Admin.css';

export default function VendedorProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      console.log('🔄 Cargando productos desde backend...');
      const productosBackend = await obtenerProductos();
      console.log('✅ Productos recibidos:', productosBackend.length);
      
      // Mapeo de IDs de categoría a nombres
      const categoriasMap = {
        1: 'Juegos de Mesa',
        2: 'Accesorios',
        3: 'Consolas',
        4: 'Videojuegos',
        5: 'Figuras',
        6: 'Otros'
      };
      
      // Mapear productos del backend al formato esperado
      const productosFormateados = productosBackend.map(p => ({
        ...p,
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion || p.descripcionCorta || '',
        categoria: categoriasMap[p.categoriaId] || 'Sin categoría',
        precio: p.precioVenta || p.precioBase || 0,
        stock: p.stockActual || 0,
        imagen: p.imagenPrincipal || '/assets/imgs/producto-default.png',
        destacado: p.destacado || false,
        activo: p.activo !== false
      }));
      
      setProductos(productosFormateados);
      console.log('📦 Productos cargados:', productosFormateados.length);
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      if (window.notificar) {
        window.notificar('Error al cargar productos del servidor', 'error', 3000);
      }
    }
  };

  const confirmarEliminar = (codigo) => {
    setProductoAEliminar(codigo);
    setMostrarModal(true);
  };

  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        const token = localStorage.getItem('token');
        const producto = productos.find(p => p.codigo === productoAEliminar);
        
        console.log('🔄 Desactivando producto:', productoAEliminar);
        await desactivarProducto(productoAEliminar, token);
        
        // Recargar productos desde el backend
        await cargarProductos();
        
        registrarLogAdmin(`Desactivó producto: ${producto?.nombre || 'Desconocido'} (${productoAEliminar})`);
        
        if (window.notificar) {
          window.notificar('Producto desactivado exitosamente', 'success', 3000);
        }
        setMostrarModal(false);
        setProductoAEliminar(null);
      } catch (error) {
        console.error('❌ Error al desactivar producto:', error);
        if (window.notificar) {
          window.notificar('Error al desactivar el producto', 'error', 3000);
        }
        setMostrarModal(false);
        setProductoAEliminar(null);
      }
    }
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setProductoAEliminar(null);
  };

  const editarProducto = (codigo) => {
    navigate(`/vendedor/productos/editar/${codigo}`);
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosSinStock = productos.filter(p => p.stock === 0 || p.stockActual === 0);

  return (
    <main className="container admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Gestión de Productos</h2>
          <Link to="/vendedor" className="text-secondary">
            ← Volver al Panel
          </Link>
        </div>
        <Link to="/vendedor/productos/nuevo" className="btn btn-success">
          + Nuevo Producto
        </Link>
      </div>

      {productosSinStock.length > 0 && (
        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <strong>⚠️ Atención:</strong>
          <span className="ms-2">
            Hay {productosSinStock.length} producto{productosSinStock.length > 1 ? 's' : ''} sin stock. 
            Los usuarios no podrán verlos hasta que agregues más unidades.
          </span>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          className="form-control admin-search-input"
          placeholder="Buscar por nombre, código o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary mb-4">No hay productos registrados</p>
          <Link to="/vendedor/productos/nuevo" className="btn btn-success">
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
                      className="admin-producto-img"
                    />
                  </td>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {producto.categoria}
                    </span>
                  </td>
                  <td className="admin-producto-precio">
                    ${producto.precio.toLocaleString('es-CL')}
                  </td>
                  <td>
                    <span className={producto.stock < 5 ? 'text-danger' : 'text-success'}>
                      {producto.stock}
                    </span>
                    {producto.stock === 0 && (
                      <span className="badge bg-danger ms-2">Sin Stock</span>
                    )}
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
                      onClick={() => confirmarEliminar(producto.codigo)}
                    >
                      Desactivar
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

      <ModalConfirmacion
        mostrar={mostrarModal}
        titulo="Desactivar Producto"
        mensaje={`¿Estás seguro de que deseas desactivar el producto ${productoAEliminar}? El producto dejará de estar visible para los clientes pero podrás reactivarlo más tarde.`}
        onConfirmar={eliminarProducto}
        onCancelar={cancelarEliminar}
      />
    </main>
  );
}
