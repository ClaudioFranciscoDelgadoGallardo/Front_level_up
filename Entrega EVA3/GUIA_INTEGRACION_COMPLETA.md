# 🔄 GUÍA DE INTEGRACIÓN FRONTEND-BACKEND

## 📋 RESUMEN

Este documento detalla paso a paso cómo integrar el frontend React con el backend de microservicios Spring Boot, migrando de LocalStorage a API REST con autenticación JWT.

---

## 🎯 OBJETIVOS DE LA INTEGRACIÓN

1. ✅ Reemplazar LocalStorage por API REST
2. ✅ Implementar autenticación JWT
3. ✅ Sincronizar datos con PostgreSQL
4. ✅ Mantener funcionalidad existente
5. ✅ Mejorar seguridad

---

## 📦 PASO 1: Configurar Servicios HTTP (Axios)

### 1.1 Crear configuración base de Axios

**Archivo:** `src/api/axiosConfig.js`

```javascript
import axios from 'axios';

// URL base del API Gateway
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error de servidor (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Sin permisos
          if (window.notificar) {
            window.notificar('No tienes permisos para esta acción', 'error', 3000);
          }
          break;
        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado:', error.response.config.url);
          break;
        case 500:
          // Error del servidor
          if (window.notificar) {
            window.notificar('Error del servidor. Intenta más tarde', 'error', 3000);
          }
          break;
        default:
          console.error('Error en la petición:', error.response.data);
      }
    } else if (error.request) {
      // No hay respuesta del servidor
      if (window.notificar) {
        window.notificar('No se puede conectar con el servidor', 'error', 3000);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 1.2 Crear archivo .env

**Archivo:** `.env` (en raíz del proyecto React)

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

**Archivo:** `.env.production`

```env
REACT_APP_API_URL=https://api.levelup.com/api
REACT_APP_ENV=production
```

---

## 🔐 PASO 2: Servicio de Autenticación

### 2.1 Crear AuthService

**Archivo:** `src/services/authService.js`

```javascript
import axios from '../api/axiosConfig';

class AuthService {
  /**
   * Iniciar sesión
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Usuario y token
   */
  async login(email, password) {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, tipo, ...userData } = response.data;

      // Guardar token y datos de usuario
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenType', tipo || 'Bearer');
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error en login';
      throw new Error(errorMessage);
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      const response = await axios.post('/auth/register', {
        run: userData.run,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        correo: userData.correo,
        password: userData.password,
        telefono: userData.telefono || '',
        direccion: userData.direccion || '',
        fechaNac: userData.fechaNac || '',
      });

      const { token, tipo, ...user } = response.data;

      // Guardar token y datos
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenType', tipo || 'Bearer');
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error en registro';
      throw new Error(errorMessage);
    }
  }

  /**
   * Validar token actual
   * @returns {Promise<boolean>}
   */
  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await axios.post('/auth/validate');
      return response.status === 200;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verificar si está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Verificar si es administrador
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.rol === 'ADMIN';
  }

  /**
   * Obtener token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
```

### 2.2 Actualizar Login.jsx

**Archivo:** `src/pages/Login.jsx`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const validarFormulario = () => {
    if (!formData.email || formData.email.trim().length === 0) {
      setError('El correo es obligatorio');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Debes ingresar un correo válido');
      return false;
    }

    if (!formData.password || formData.password.trim().length === 0) {
      setError('La contraseña es obligatoria');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (window.notificar) {
        window.notificar(`¡Bienvenido ${response.nombre}!`, 'success', 3000);
      }

      // Redirigir según rol
      setTimeout(() => {
        if (response.rol === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (err) {
      setError(err.message);
      if (window.notificar) {
        window.notificar(err.message, 'error', 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h2 className="section-title">Inicio de sesión</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form id="form-login" onSubmit={handleSubmit} noValidate>
        <label htmlFor="login-email">Correo</label>
        <input 
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label htmlFor="login-pass">Contraseña</label>
        <input 
          id="login-pass"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <button 
          className="btn btn-success" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </button>

        <div className="mt-3 text-center">
          <p className="text-muted">
            Usuario demo: <code>admin@levelup.cl</code> / <code>admin123</code>
          </p>
        </div>
      </form>
    </main>
  );
}
```

### 2.3 Actualizar Registro.jsx

**Archivo:** `src/pages/Registro.jsx`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Registro.css';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    fechaNac: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validarFormulario = () => {
    if (!formData.run || formData.run.length < 7 || formData.run.length > 9) {
      setError('El RUN debe tener entre 7 y 9 caracteres');
      return false;
    }

    if (!formData.nombre || formData.nombre.length > 50) {
      setError('El nombre es obligatorio y debe tener máximo 50 caracteres');
      return false;
    }

    if (!formData.apellidos || formData.apellidos.length > 100) {
      setError('Los apellidos son obligatorios y deben tener máximo 100 caracteres');
      return false;
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError('Debes ingresar un correo válido');
      return false;
    }

    if (!formData.password || formData.password.length < 4 || formData.password.length > 20) {
      setError('La contraseña debe tener entre 4 y 20 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      
      if (window.notificar) {
        window.notificar(`¡Usuario ${response.nombre} registrado exitosamente!`, 'success', 3000);
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      setError(err.message);
      if (window.notificar) {
        window.notificar(err.message, 'error', 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h2 className="section-title">Registro de usuario</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form id="form-registro" onSubmit={handleSubmit} noValidate>
        <label htmlFor="run">RUN</label>
        <input
          id="run"
          name="run"
          type="text"
          value={formData.run}
          onChange={handleChange}
          placeholder="12345678-9"
          disabled={loading}
          required
        />

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label htmlFor="apellidos">Apellidos</label>
        <input
          id="apellidos"
          name="apellidos"
          type="text"
          value={formData.apellidos}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <label htmlFor="telefono">Teléfono (opcional)</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="direccion">Dirección (opcional)</label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          value={formData.direccion}
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="fechaNac">Fecha de Nacimiento (opcional)</label>
        <input
          id="fechaNac"
          name="fechaNac"
          type="date"
          value={formData.fechaNac}
          onChange={handleChange}
          disabled={loading}
        />

        <button 
          className="btn btn-success" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registrando...
            </>
          ) : (
            'Registrarse'
          )}
        </button>
      </form>
    </main>
  );
}
```

### 2.4 Actualizar ProtectedRoute

**Archivo:** `src/components/ProtectedRoute.jsx`

```javascript
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      const isAdm = authService.isAdmin();
      
      if (isAuth && isAdm) {
        // Validar token con el servidor
        const valid = await authService.validateToken();
        setIsValid(valid);
      } else {
        setIsValid(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

---

## 📦 PASO 3: Servicio de Productos

### 3.1 Crear ProductService

**Archivo:** `src/services/productService.js`

```javascript
import axios from '../api/axiosConfig';

class ProductService {
  /**
   * Obtener todos los productos activos
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await axios.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  /**
   * Obtener productos destacados
   * @returns {Promise<Array>}
   */
  async getFeatured() {
    try {
      const response = await axios.get('/productos/destacados');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo destacados:', error);
      throw error;
    }
  }

  /**
   * Obtener producto por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await axios.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Buscar productos por nombre
   * @param {string} nombre 
   * @returns {Promise<Array>}
   */
  async searchByName(nombre) {
    try {
      const response = await axios.get('/productos/buscar', {
        params: { nombre }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando productos:', error);
      throw error;
    }
  }

  /**
   * Obtener productos por categoría
   * @param {string} categoria 
   * @returns {Promise<Array>}
   */
  async getByCategory(categoria) {
    try {
      const response = await axios.get(`/productos/categoria/${categoria}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo por categoría:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo producto (Admin)
   * @param {Object} producto 
   * @returns {Promise<Object>}
   */
  async create(producto) {
    try {
      const response = await axios.post('/productos', producto);
      return response.data;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar producto (Admin)
   * @param {number} id 
   * @param {Object} producto 
   * @returns {Promise<Object>}
   */
  async update(id, producto) {
    try {
      const response = await axios.put(`/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * Eliminar producto (Admin)
   * @param {number} id 
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      const response = await axios.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar stock de producto
   * @param {number} id 
   * @param {number} cantidad 
   * @returns {Promise<Object>}
   */
  async updateStock(id, cantidad) {
    try {
      const response = await axios.patch(`/productos/${id}/stock`, null, {
        params: { cantidad }
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  }
}

export default new ProductService();
```

### 3.2 Actualizar Productos.jsx

**Archivo:** `src/pages/Productos.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import productService from '../services/productService';
import '../styles/Productos.css';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      if (window.notificar) {
        window.notificar('Error al cargar productos', 'error', 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const categoriasDisponibles = [
    'todas',
    ...new Set(productos.map(p => p.categoria))
  ];

  let productosFiltrados = productos.filter(producto => {
    const cumpleCategoria = filtroCategoria === 'todas' || 
                           producto.categoria === filtroCategoria;
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleCategoria && cumpleBusqueda && producto.stock > 0;
  });

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    if (window.notificar) {
      window.notificar(`¡${producto.nombre} agregado al carrito!`, 'success', 3000);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container">
      <h2 className="section-title">Productos</h2>
      
      {/* Barra de búsqueda */}
      <div className="search-container mb-4">
        <input
          type="text"
          className="search-input form-control"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <div className="filtros-productos mb-4">
        <div className="d-flex gap-2 flex-wrap">
          {categoriasDisponibles.map(categoria => (
            <button
              key={categoria}
              className={`btn ${filtroCategoria === categoria ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFiltroCategoria(categoria)}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="col">
            <div className="card h-100">
              <img 
                src={producto.imagenUrl || producto.imagen} 
                className="card-img-top" 
                alt={producto.nombre}
                onError={(e) => e.target.src = '/assets/imgs/placeholder.png'}
              />
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text">
                  <strong>${producto.precio.toLocaleString('es-CL')}</strong>
                </p>
                <p className="text-muted">Stock: {producto.stock}</p>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleAgregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                  >
                    Agregar al Carrito
                  </button>
                  <Link 
                    to={`/detalle/${producto.codigo || producto.id}`} 
                    className="btn btn-outline-primary"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="alert alert-info text-center">
          No se encontraron productos con los filtros seleccionados.
        </div>
      )}
    </main>
  );
}
```

---

## 🛒 PASO 4: Servicio de Órdenes

### 4.1 Crear OrderService

**Archivo:** `src/services/orderService.js`

```javascript
import axios from '../api/axiosConfig';

class OrderService {
  /**
   * Crear nueva orden
   * @param {Object} orderData 
   * @returns {Promise<Object>}
   */
  async create(orderData) {
    try {
      const response = await axios.post('/ordenes', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creando orden:', error);
      throw error;
    }
  }

  /**
   * Obtener órdenes del usuario actual
   * @param {number} usuarioId 
   * @returns {Promise<Array>}
   */
  async getByUser(usuarioId) {
    try {
      const response = await axios.get(`/ordenes/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo órdenes:', error);
      throw error;
    }
  }

  /**
   * Obtener orden por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await axios.get(`/ordenes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado de orden
   * @param {number} id 
   * @param {string} estado 
   * @returns {Promise<Object>}
   */
  async updateStatus(id, estado) {
    try {
      const response = await axios.patch(`/ordenes/${id}/estado`, null, {
        params: { estado }
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  }

  /**
   * Cancelar orden
   * @param {number} id 
   * @returns {Promise<void>}
   */
  async cancel(id) {
    try {
      const response = await axios.delete(`/ordenes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelando orden:', error);
      throw error;
    }
  }
}

export default new OrderService();
```

### 4.2 Actualizar proceso de compra en CarritoContext

**Archivo:** `src/context/CarritoContext.jsx` (añadir método)

```javascript
import productService from '../services/productService';
import orderService from '../services/orderService';
import authService from '../services/authService';

// ... código existente ...

const finalizarCompra = async (direccionEnvio, metodoPago) => {
  try {
    const usuario = authService.getCurrentUser();
    
    if (!usuario) {
      throw new Error('Debes iniciar sesión para finalizar la compra');
    }

    if (carrito.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Crear la orden
    const ordenData = {
      usuarioId: usuario.id,
      usuarioNombre: `${usuario.nombre} ${usuario.apellidos}`,
      usuarioCorreo: usuario.correo,
      direccionEnvio: direccionEnvio || usuario.direccion || '',
      metodoPago: metodoPago || 'Efectivo',
      detalles: carrito.map(item => ({
        productoId: item.id,
        productoNombre: item.nombre,
        cantidad: item.qty,
        precioUnitario: item.precio
      }))
    };

    const ordenCreada = await orderService.create(ordenData);

    // Limpiar carrito
    vaciarCarrito();

    if (window.notificar) {
      window.notificar('¡Compra realizada exitosamente!', 'success', 3000);
    }

    return ordenCreada;
  } catch (error) {
    console.error('Error en compra:', error);
    if (window.notificar) {
      window.notificar(error.message || 'Error al procesar la compra', 'error', 3000);
    }
    throw error;
  }
};

// Agregar al return del Provider
return (
  <CarritoContext.Provider value={{
    // ...valores existentes
    finalizarCompra
  }}>
    {children}
  </CarritoContext.Provider>
);
```

---

## ✅ PASO 5: Testing y Validación

### 5.1 Checklist de Pruebas

```
Auth Service:
[ ] Login con credenciales correctas
[ ] Login con credenciales incorrectas
[ ] Registro de nuevo usuario
[ ] Registro con email duplicado
[ ] Validación de token
[ ] Logout

Product Service:
[ ] Cargar todos los productos
[ ] Filtrar por categoría
[ ] Buscar por nombre
[ ] Ver detalle de producto
[ ] Agregar al carrito
[ ] (Admin) Crear producto
[ ] (Admin) Editar producto
[ ] (Admin) Eliminar producto

Order Service:
[ ] Crear orden desde carrito
[ ] Ver historial de órdenes
[ ] Ver detalle de orden
[ ] (Admin) Actualizar estado de orden
[ ] Cancelar orden
```

### 5.2 Script de Prueba

**Archivo:** `src/utils/testIntegration.js`

```javascript
import authService from '../services/authService';
import productService from '../services/productService';
import orderService from '../services/orderService';

export const testIntegration = async () => {
  console.log('🧪 Iniciando tests de integración...\n');

  try {
    // Test 1: Login
    console.log('1. Probando login...');
    const loginResult = await authService.login('admin@levelup.cl', 'admin123');
    console.log('✅ Login exitoso:', loginResult.nombre);

    // Test 2: Obtener productos
    console.log('\n2. Probando obtener productos...');
    const productos = await productService.getAll();
    console.log(`✅ Productos obtenidos: ${productos.length}`);

    // Test 3: Crear orden
    console.log('\n3. Probando crear orden...');
    const ordenData = {
      usuarioId: loginResult.id,
      usuarioNombre: loginResult.nombre,
      usuarioCorreo: loginResult.correo,
      direccionEnvio: 'Test Address',
      metodoPago: 'Tarjeta',
      detalles: [{
        productoId: productos[0].id,
        productoNombre: productos[0].nombre,
        cantidad: 1,
        precioUnitario: productos[0].precio
      }]
    };
    const orden = await orderService.create(ordenData);
    console.log('✅ Orden creada:', orden.id);

    console.log('\n✅ Todos los tests pasaron correctamente!');
  } catch (error) {
    console.error('\n❌ Error en tests:', error.message);
  }
};
```

---

## 📝 RESUMEN DE CAMBIOS

### Archivos Nuevos
1. `src/api/axiosConfig.js` - Configuración de Axios
2. `src/services/authService.js` - Servicio de autenticación
3. `src/services/productService.js` - Servicio de productos
4. `src/services/orderService.js` - Servicio de órdenes
5. `.env` - Variables de entorno
6. `src/utils/testIntegration.js` - Tests de integración

### Archivos Modificados
1. `src/pages/Login.jsx` - Usar AuthService
2. `src/pages/Registro.jsx` - Usar AuthService
3. `src/pages/Productos.jsx` - Usar ProductService
4. `src/components/ProtectedRoute.jsx` - Validar token
5. `src/context/CarritoContext.jsx` - Agregar finalizarCompra
6. `src/components/Header.jsx` - Usar AuthService para logout

### Datos Migrados
- ✅ Autenticación: LocalStorage → JWT en backend
- ✅ Usuarios: LocalStorage → PostgreSQL
- ✅ Productos: LocalStorage → PostgreSQL
- ✅ Órdenes: LocalStorage → PostgreSQL
- ⚠️ Carrito: Mantener en LocalStorage (temporal)
- ⚠️ Logs: Migrar a Analytics Service (futuro)

---

## 🚀 SIGUIENTE PASO

1. **Compilar backend:**
   ```cmd
   verify-project.bat
   ```

2. **Iniciar microservicios:**
   ```cmd
   start-services.bat
   ```

3. **Iniciar frontend:**
   ```cmd
   cd level-up
   npm start
   ```

4. **Probar integración:**
   - Abrir http://localhost:3000
   - Login con admin@levelup.cl / admin123
   - Verificar que funciona con el backend

---

**Estado de Integración:** 🟡 **EN PROGRESO**  
**Próximo Milestone:** 🎯 **Frontend Completamente Integrado con Backend**

