import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { registrarLogAdmin } from '../utils/logManager';
import { uploadFile, validateFile, getFileUrl } from '../services/fileService';
import { obtenerProductoPorCodigo, actualizarProducto, crearProducto } from '../services/productService';
import '../styles/Admin.css';

export default function VendedorProductoForm() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!codigo;

  const [formData, setFormData] = useState({
    id: null,
    codigo: '',
    nombre: '',
    categoria: 'Juegos de Mesa',
    categoriaId: 1,
    precio: '',
    stock: '',
    descripcion: '',
    imagen: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      if (esEdicion) {
        try {
          setLoading(true);
          console.log('🔍 Cargando producto:', codigo);
          const producto = await obtenerProductoPorCodigo(codigo);
          
          // Mapeo de IDs de categoría a nombres
          const categoriasMap = {
            1: 'Juegos de Mesa',
            2: 'Accesorios',
            3: 'Consolas',
            4: 'Videojuegos',
            5: 'Figuras',
            6: 'Otros'
          };
          
          setFormData({
            id: producto.id,
            codigo: producto.codigo,
            nombre: producto.nombre,
            categoria: categoriasMap[producto.categoriaId] || 'Juegos de Mesa',
            categoriaId: producto.categoriaId || 1,
            precio: producto.precioVenta || producto.precioBase || '',
            stock: producto.stockActual || '',
            descripcion: producto.descripcion || producto.descripcionCorta || '',
            imagen: producto.imagenPrincipal || ''
          });
          console.log('✅ Producto cargado:', producto);
        } catch (error) {
          console.error('❌ Error al cargar producto:', error);
          if (window.notificar) {
            window.notificar('Producto no encontrado', 'error', 3000);
          }
          navigate('/vendedor/productos');
        } finally {
          setLoading(false);
        }
      }
    };
    
    cargarProducto();
  }, [codigo, esEdicion, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la categoría, actualizar también el categoriaId
    if (name === 'categoria') {
      const categoriasIdMap = {
        'Juegos de Mesa': 1,
        'Accesorios': 2,
        'Consolas': 3,
        'Videojuegos': 4,
        'Figuras': 5,
        'Otros': 6
      };
      
      setFormData(prev => ({
        ...prev,
        categoria: value,
        categoriaId: categoriasIdMap[value] || 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      if (window.notificar) {
        window.notificar(validation.error, 'error', 3000);
      }
      return;
    }

    setUploadingImage(true);

    try {
      // Usar el nombre del producto si está disponible, sino el código
      const productName = formData.nombre || formData.codigo || 'producto';
      const result = await uploadFile(file, 'productos', productName);
      setFormData(prev => ({
        ...prev,
        imagen: result.fileUrl || result.filename
      }));

      if (window.notificar) {
        window.notificar('Imagen subida exitosamente', 'success', 2000);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      if (window.notificar) {
        window.notificar('Error al subir la imagen. Intenta nuevamente.', 'error', 3000);
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagen: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo.trim() || !formData.nombre.trim() || !formData.precio || !formData.stock || !formData.descripcion.trim() || !formData.imagen.trim()) {
      if (window.notificar) {
        window.notificar('Por favor completa todos los campos obligatorios', 'error', 3000);
      }
      return;
    }

    const precio = parseFloat(formData.precio);
    if (precio >= 10000000) {
      if (window.notificar) {
        window.notificar('El precio no puede ser mayor o igual a $10.000.000', 'error', 3000);
      }
      return;
    }

    if (precio <= 0) {
      if (window.notificar) {
        window.notificar('El precio debe ser mayor a $0', 'error', 3000);
      }
      return;
    }

    const stock = parseInt(formData.stock);
    if (stock >= 10000000) {
      if (window.notificar) {
        window.notificar('El stock no puede ser mayor o igual a 10.000.000', 'error', 3000);
      }
      return;
    }

    if (stock < 0) {
      if (window.notificar) {
        window.notificar('El stock no puede ser negativo', 'error', 3000);
      }
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (esEdicion) {
        // Para edición, usar ActualizarProductoRequest DTO
        const updateData = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: precio,
          categoria: formData.categoria,
          categoriaId: formData.categoriaId,
          stock: stock,
          imagenUrl: formData.imagen,
          activo: true
        };

        console.log('🔄 Actualizando producto ID:', formData.id, 'CategoriaId:', formData.categoriaId);
        await actualizarProducto(formData.id, updateData, token);
        registrarLogAdmin(`Vendedor editó producto: ${formData.nombre} (${formData.codigo})`);
        if (window.notificar) {
          window.notificar('Producto actualizado exitosamente', 'success', 3000);
        }
        console.log('✅ Producto actualizado');
      } else {
        // Para creación, usar Producto completo
        const productData = {
          codigo: formData.codigo,
          nombre: formData.nombre,
          categoriaId: formData.categoriaId,
          precioBase: precio,
          precioVenta: precio,
          costo: precio * 0.7,
          stockActual: stock,
          descripcion: formData.descripcion,
          imagenPrincipal: formData.imagen,
          activo: true
        };
        
        console.log('🔄 Creando producto:', formData.codigo);
        await crearProducto(productData, token);
        registrarLogAdmin(`Vendedor creó producto: ${formData.nombre} (${formData.codigo})`);
        if (window.notificar) {
          window.notificar('Producto creado exitosamente', 'success', 3000);
        }
        console.log('✅ Producto creado');
      }
      
      navigate('/vendedor/productos');
    } catch (error) {
      console.error('❌ Error al guardar producto:', error);
      if (window.notificar) {
        window.notificar(error.message || 'Error al guardar el producto', 'error', 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container admin-page">
      <div className="mb-4">
        <h2 className="section-title mb-2">
          {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <Link to="/vendedor/productos" className="text-secondary">
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
              min="1"
              max="9999999"
              step="1"
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
              max="9999999"
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción *</label>
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
            <label htmlFor="imagen" className="form-label">Imagen del Producto *</label>
            <div className="mb-2">
              <label 
                htmlFor="imagenFile" 
                className={`btn btn-success w-100 admin-form-imagen-label ${uploadingImage ? 'disabled' : ''}`}
              >
                {uploadingImage ? '⏳ Subiendo imagen...' : '📁 Seleccionar Imagen desde el Computador'}
              </label>
              <input
                type="file"
                className="form-control admin-form-imagen-input-hidden"
                id="imagenFile"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
              />
              <small className="admin-form-imagen-info">Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB</small>
            </div>
            <div className="mb-2 admin-form-url-label">O ingresa una URL:</div>
            <input
              type="text"
              className="form-control"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="/assets/imgs/producto.png o https://ejemplo.com/imagen.jpg"
              disabled={uploadingImage}
            />
            {formData.imagen && (
              <div className="mt-3 text-center">
                <p className="text-white mb-2">Vista previa:</p>
                <img 
                  src={getFileUrl(formData.imagen)} 
                  alt="Preview"
                  className="admin-form-preview-img"
                  onError={(e) => {
                    e.target.src = '/assets/icons/icono.png';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3 mt-4 justify-content-center">
          <button 
            type="submit" 
            className="btn btn-success px-5"
            disabled={uploadingImage || loading}
          >
            {loading ? '⏳ Guardando...' : uploadingImage ? 'Esperando imagen...' : (esEdicion ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
          <Link 
            to="/vendedor/productos" 
            className="btn btn-secondary px-5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
