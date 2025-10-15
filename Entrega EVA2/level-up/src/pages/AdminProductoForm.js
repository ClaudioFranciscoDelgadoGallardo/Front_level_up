import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminProductoForm() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!codigo;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Juegos de Mesa',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: ''
  });

  useEffect(() => {
    if (esEdicion) {
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const producto = productos.find(p => p.codigo === codigo);
      if (producto) {
        setFormData(producto);
      } else {
        if (window.notificar) {
          window.notificar('Producto no encontrado', 'error', 3000);
        }
        navigate('/admin/productos');
      }
    }
  }, [codigo, esEdicion, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nombre || !formData.precio || !formData.stock) {
      if (window.notificar) {
        window.notificar('Por favor completa todos los campos obligatorios', 'error', 3000);
      }
      return;
    }

    const productos = JSON.parse(localStorage.getItem('productos') || '[]');

    if (esEdicion) {
      const index = productos.findIndex(p => p.codigo === codigo);
      if (index !== -1) {
        productos[index] = {
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock)
        };
        localStorage.setItem('productos', JSON.stringify(productos));
        if (window.notificar) {
          window.notificar('Producto actualizado exitosamente', 'success', 3000);
        }
        navigate('/admin/productos');
      }
    } else {
      if (productos.some(p => p.codigo === formData.codigo)) {
        if (window.notificar) {
          window.notificar('Ya existe un producto con ese código', 'error', 3000);
        }
        return;
      }

      productos.push({
        ...formData,
        id: formData.codigo,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      });
      localStorage.setItem('productos', JSON.stringify(productos));
      if (window.notificar) {
        window.notificar('Producto creado exitosamente', 'success', 3000);
      }
      navigate('/admin/productos');
    }
  };

  return (
    <main className="container admin-page">
      <div className="mb-4">
        <h2 className="section-title mb-2">
          {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <Link to="/admin/productos" className="text-secondary">
          ← Volver a Productos
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="codigo" className="form-label">Código *</label>
            <input
              type="text"
              className="form-control"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              disabled={esEdicion}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="nombre" className="form-label">Nombre *</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="categoria" className="form-label">Categoría *</label>
            <select
              className="form-select"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="Juegos de Mesa">Juegos de Mesa</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Consolas">Consolas</option>
              <option value="Videojuegos">Videojuegos</option>
              <option value="Figuras">Figuras</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="precio" className="form-label">Precio *</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="stock" className="form-label">Stock *</label>
            <input
              type="number"
              className="form-control"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
            <input
              type="text"
              className="form-control"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="/assets/imgs/producto.png"
            />
            {formData.imagen && (
              <div className="mt-3 text-center">
                <img 
                  src={formData.imagen} 
                  alt="Preview"
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #333'
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/icons/icono.png';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button 
            type="submit" 
            className="btn btn-success px-5"
          >
            {esEdicion ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
          <Link 
            to="/admin/productos" 
            className="btn btn-secondary px-5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
