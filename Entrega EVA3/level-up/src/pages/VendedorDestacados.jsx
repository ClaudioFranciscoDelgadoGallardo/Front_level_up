import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrarLogAdmin } from '../utils/logManager';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { obtenerProductos, actualizarProducto } from '../services/productService';
import '../styles/Admin.css';

export default function VendedorDestacados() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [cargando, setCargando] = useState(true);

  const categoriasMap = {
    1: 'Juegos de Mesa',
    2: 'Accesorios',
    3: 'Consolas',
    4: 'Videojuegos',
    5: 'Figuras',
    6: 'Otros'
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const productosBackend = await obtenerProductos(token);
      
      // Mapear productos del backend al formato esperado
      const productosFormateados = productosBackend.map(p => ({
        ...p,
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion || p.descripcionCorta || '',
        categoria: categoriasMap[p.categoriaId] || 'Sin categoría',
        categoriaId: p.categoriaId,
        precio: p.precioVenta || p.precioBase || 0,
        stock: p.stockActual || 0,
        imagen: p.imagenPrincipal || '/assets/imgs/producto-default.png',
        imagenPrincipal: p.imagenPrincipal || '/assets/imgs/producto-default.png',
        destacado: p.destacado || false,
        activo: p.activo !== false
      }));
      
      // Filtrar solo productos activos
      const productosActivos = productosFormateados.filter(p => p.activo === true);
      
      setProductos(productosActivos);
      console.log('📦 Productos destacados cargados:', productosActivos.length);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      if (window.notificar) {
        window.notificar('Error al cargar productos', 'error', 3000);
      }
    } finally {
      setCargando(false);
    }
  };

  const destacados = productos.filter(p => p.destacado === true);

  const agregarDestacado = async () => {
    if (!productoSeleccionado) {
      if (window.notificar) {
        window.notificar('Debes seleccionar un producto', 'error', 3000);
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
      
      if (!producto) {
        if (window.notificar) {
          window.notificar('El producto seleccionado no existe', 'error', 3000);
        }
        return;
      }

      console.log('🌟 Agregando producto a destacados:', producto.id, producto.codigo);
      
      // Actualizar el producto para marcarlo como destacado (usar ID)
      await actualizarProducto(producto.id, { destacado: true }, token);
      
      // Recargar productos
      await cargarProductos();
      setProductoSeleccionado('');
      
      registrarLogAdmin(`Agregó producto a destacados: ${producto.nombre} (${producto.codigo})`);
      
      if (window.notificar) {
        window.notificar('Producto agregado a destacados exitosamente', 'success', 3000);
      }
    } catch (error) {
      console.error('Error al agregar destacado:', error);
      if (window.notificar) {
        window.notificar('Error al agregar producto a destacados', 'error', 3000);
      }
    }
  };

  const confirmarEliminar = (id) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const eliminarDestacado = async () => {
    if (productoAEliminar) {
      try {
        const token = localStorage.getItem('token');
        const producto = productos.find(p => p.id === productoAEliminar);
        
        if (!producto) {
          if (window.notificar) {
            window.notificar('Producto no encontrado', 'error', 3000);
          }
          return;
        }

        console.log('❌ Eliminando producto de destacados:', producto.id, producto.codigo);
        
        // Actualizar el producto para desmarcarlo como destacado (usar ID)
        await actualizarProducto(producto.id, { destacado: false }, token);
        
        // Recargar productos para actualizar ambas listas
        await cargarProductos();
        
        registrarLogAdmin(`Eliminó producto de destacados: ${producto.nombre} (${producto.codigo})`);
        
        if (window.notificar) {
          window.notificar('Producto eliminado de destacados exitosamente', 'success', 3000);
        }
      } catch (error) {
        console.error('Error al eliminar destacado:', error);
        if (window.notificar) {
          window.notificar('Error al eliminar producto de destacados', 'error', 3000);
        }
      } finally {
        setMostrarModal(false);
        setProductoAEliminar(null);
      }
    }
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setProductoAEliminar(null);
  };

  const productosDisponibles = productos.filter(p => p.destacado !== true);

  return (
    <main className="container admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Gestión de Productos Destacados</h2>
          <p className="admin-destacados-info">
            Total de productos destacados: <span className="admin-destacados-contador">{destacados.length}</span>
          </p>
          <Link to="/vendedor" className="text-secondary">
            ← Volver al Panel
          </Link>
        </div>
      </div>

      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h4>Agregar Producto Destacado</h4>
        </div>
        <div className="admin-card-body">
          <div className="row align-items-end">
            <div className="col-md-9 mb-3 mb-md-0">
              <label className="form-label text-white">Seleccionar Producto Existente</label>
              <select
                className="form-control admin-destacados-select"
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                disabled={cargando}
              >
                <option value="">-- Seleccione un producto --</option>
                {productosDisponibles.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.codigo} - {producto.nombre} (${(producto.precio || 0).toLocaleString('es-CL')})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-success w-100"
                onClick={agregarDestacado}
                disabled={cargando}
              >
                + Agregar Destacado
              </button>
            </div>
          </div>
          {productosDisponibles.length === 0 && productos.length > 0 && (
            <div className="alert alert-info mt-3 mb-0">
              Todos los productos activos ya están destacados.
            </div>
          )}
          {productos.length === 0 && !cargando && (
            <div className="alert alert-warning mt-3 mb-0">
              No hay productos activos registrados. <Link to="/vendedor/productos/nuevo" className="alert-link">Crear producto</Link>
            </div>
          )}
          {cargando && (
            <div className="alert alert-info mt-3 mb-0">
              Cargando productos...
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h4>Productos Destacados en el Carrusel</h4>
        </div>
        <div className="admin-card-body">
          {cargando ? (
            <div className="text-center py-4">
              <p className="text-white">Cargando productos destacados...</p>
            </div>
          ) : destacados.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-secondary">No hay productos destacados</p>
              <p className="text-white">Los productos que agregues aquí aparecerán en el carrusel de la página de inicio</p>
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {destacados.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        <img 
                          src={producto.imagenPrincipal || '/assets/icons/icono.png'} 
                          alt={producto.nombre}
                          width="50"
                          height="50"
                          className="admin-producto-img"
                        />
                      </td>
                      <td>{producto.codigo || 'N/A'}</td>
                      <td>{producto.nombre || 'Sin nombre'}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {categoriasMap[producto.categoriaId] || producto.categoria || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="admin-producto-precio">
                        ${(producto.precio || 0).toLocaleString('es-CL')}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger btn-action"
                          onClick={() => confirmarEliminar(producto.id)}
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
        </div>
      </div>

      <ModalConfirmacion
        mostrar={mostrarModal}
        titulo="Eliminar Producto Destacado"
        mensaje={`¿Estás seguro de que deseas eliminar este producto de destacados? El producto seguirá existiendo pero ya no aparecerá en el carrusel.`}
        onConfirmar={eliminarDestacado}
        onCancelar={cancelarEliminar}
      />
    </main>
  );
}
