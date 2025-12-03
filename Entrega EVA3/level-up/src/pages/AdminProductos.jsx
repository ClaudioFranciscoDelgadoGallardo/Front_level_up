import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarLogAdmin } from '../utils/logManager';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { obtenerTodosLosProductos, desactivarProducto as desactivarProductoService, actualizarProducto } from '../services/productService';
import '../styles/Admin.css';

const categoriasMap = {
  1: 'Juegos de Mesa',
  2: 'Accesorios',
  3: 'Consolas',
  4: 'Videojuegos',
  5: 'Figuras',
  6: 'Otros'
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDesactivar, setMostrarModalDesactivar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [productoADesactivar, setProductoADesactivar] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando TODOS los productos desde backend (incluyendo desactivados)...');
      const productosBackend = await obtenerTodosLosProductos();
      console.log('✅ Productos recibidos:', productosBackend.length);
      
      const productosFormateados = productosBackend.map(p => ({
        ...p,
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion || p.descripcionCorta || '',
        categoria: categoriasMap[p.categoriaId] || 'Sin categoría',
        precio: p.precioVenta || p.precioBase || 0,
        stock: p.stockActual || 0,
        imagen: p.imagenPrincipal || '/assets/icons/icono.png',
        destacado: p.destacado || false,
        activo: p.activo !== false
      }));
      
      console.log('📦 Productos cargados:', productosFormateados.length);
      setProductos(productosFormateados);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      if (window.notificar) {
        window.notificar('Error al cargar productos del servidor', 'error', 3000);
      }
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminar = (id) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const confirmarDesactivar = (codigo) => {
    setProductoADesactivar(codigo);
    setMostrarModalDesactivar(true);
  };

  const cancelarDesactivar = () => {
    setMostrarModalDesactivar(false);
    setProductoADesactivar(null);
  };

  const desactivarProducto = async () => {
    if (productoADesactivar) {
      try {
        setCargando(true);
        const producto = productos.find(p => p.codigo === productoADesactivar);
        
        console.log('🔄 Desactivando producto código:', productoADesactivar);
        
        await desactivarProductoService(productoADesactivar);
        
        // Recargar productos
        await cargarProductos();
        
        registrarLogAdmin(`Desactivó producto: ${producto?.nombre || 'Desconocido'} (${productoADesactivar})`);
        
        if (window.notificar) {
          window.notificar('Producto desactivado exitosamente', 'success', 3000);
        }
        setMostrarModalDesactivar(false);
        setProductoADesactivar(null);
      } catch (error) {
        console.error('❌ Error al desactivar producto:', error);
        if (window.notificar) {
          window.notificar(error.message || 'Error al desactivar el producto', 'error', 4000);
        }
        setMostrarModalDesactivar(false);
        setProductoADesactivar(null);
      } finally {
        setCargando(false);
      }
    }
  };

  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        setCargando(true);
        const token = localStorage.getItem('token');
        const producto = productos.find(p => p.id === productoAEliminar);
        
        console.log('🔄 Eliminando permanentemente producto ID:', productoAEliminar);
        
        // Eliminar permanentemente usando el ID
        const response = await fetch(`http://localhost:8080/api/productos/${productoAEliminar}/permanente`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al eliminar producto');
        }
        
        // Recargar productos desde el backend
        await cargarProductos();
        
        registrarLogAdmin(`Eliminó permanentemente producto: ${producto?.nombre || 'Desconocido'} (${producto?.codigo || productoAEliminar})`);
        
        if (window.notificar) {
          window.notificar('Producto eliminado exitosamente', 'success', 3000);
        }
        setMostrarModal(false);
        setProductoAEliminar(null);
      } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        if (window.notificar) {
          window.notificar(error.message || 'Error al eliminar el producto', 'error', 4000);
        }
        setMostrarModal(false);
        setProductoAEliminar(null);
      } finally {
        setCargando(false);
      }
    }
  };

  const activarProducto = async (producto) => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Activando producto:', producto.codigo, 'ID:', producto.id);
      await actualizarProducto(producto.id, { activo: true }, token);
      
      // Recargar productos desde el backend
      await cargarProductos();
      
      registrarLogAdmin(`Activó producto: ${producto.nombre} (${producto.codigo})`);
      
      if (window.notificar) {
        window.notificar('Producto activado exitosamente', 'success', 3000);
      }
    } catch (error) {
      console.error('❌ Error al activar producto:', error);
      if (window.notificar) {
        window.notificar('Error al activar el producto', 'error', 3000);
      }
    } finally {
      setCargando(false);
    }
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setProductoAEliminar(null);
  };

  const editarProducto = (codigo) => {
    navigate(`/admin/productos/editar/${codigo}`);
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosActivos = productos.filter(p => p.activo);
  const productosDesactivados = productos.filter(p => !p.activo);
  const productosSinStock = productosActivos.filter(p => p.stock === 0 || p.stockActual === 0);

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

      {productosDesactivados.length > 0 && (
        <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
          <strong>ℹ️ Información:</strong>
          <span className="ms-2">
            Hay {productosDesactivados.length} producto{productosDesactivados.length > 1 ? 's' : ''} desactivado{productosDesactivados.length > 1 ? 's' : ''}. 
            Los usuarios no pueden verlos hasta que los actives.
          </span>
        </div>
      )}

      {productosSinStock.length > 0 && (
        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <strong>⚠️ Atención:</strong>
          <span className="ms-2">
            Hay {productosSinStock.length} producto{productosSinStock.length > 1 ? 's' : ''} activo{productosSinStock.length > 1 ? 's' : ''} sin stock. 
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

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mt-3">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
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
                <th>Estado</th>
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
                    {producto.stock === 0 && producto.activo && (
                      <span className="badge bg-danger ms-2">Sin Stock</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${producto.activo ? 'bg-success' : 'bg-danger'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary btn-action"
                      onClick={() => editarProducto(producto.codigo)}
                      disabled={cargando}
                    >
                      Editar
                    </button>
                    {producto.activo ? (
                      <button 
                        className="btn btn-sm btn-warning btn-action"
                        onClick={() => confirmarDesactivar(producto.codigo)}
                        disabled={cargando}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-success btn-action"
                        onClick={() => activarProducto(producto)}
                        disabled={cargando}
                      >
                        Activar
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-danger btn-action"
                      onClick={() => confirmarEliminar(producto.id)}
                      disabled={cargando}
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

      <ModalConfirmacion
        mostrar={mostrarModalDesactivar}
        titulo="Desactivar Producto"
        mensaje="¿Estás seguro de que deseas desactivar este producto? El producto estará oculto para los clientes pero se mantendrá en el sistema."
        onConfirmar={desactivarProducto}
        onCancelar={cancelarDesactivar}
      />

      <ModalConfirmacion
        mostrar={mostrarModal}
        titulo="Eliminar Producto"
        mensaje="¿Estás seguro de que deseas eliminar este producto PERMANENTEMENTE? Esta acción NO se puede deshacer y se perderán todos los datos del producto."
        onConfirmar={eliminarProducto}
        onCancelar={cancelarEliminar}
      />
    </main>
  );
}
