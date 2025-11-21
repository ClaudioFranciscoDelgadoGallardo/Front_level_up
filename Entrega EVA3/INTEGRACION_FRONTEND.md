# Guía de Integración - Frontend y Móvil

## 🌐 Integración con React (Web)

### Configuración Axios

```javascript
// src/api/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Servicio de Autenticación

```javascript
// src/services/authService.js
import axios from '../api/axiosConfig';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error en login';
    }
  }

  async register(userData) {
    try {
      const response = await axios.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error en registro';
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return user && user.token;
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.rol === 'ADMIN';
  }
}

export default new AuthService();
```

### Servicio de Productos

```javascript
// src/services/productService.js
import axios from '../api/axiosConfig';

class ProductService {
  async getAll() {
    const response = await axios.get('/productos');
    return response.data;
  }

  async getFeatured() {
    const response = await axios.get('/productos/destacados');
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`/productos/${id}`);
    return response.data;
  }

  async searchByName(nombre) {
    const response = await axios.get('/productos/buscar', {
      params: { nombre }
    });
    return response.data;
  }

  async getByCategory(categoria) {
    const response = await axios.get(`/productos/categoria/${categoria}`);
    return response.data;
  }

  async create(producto) {
    const response = await axios.post('/productos', producto);
    return response.data;
  }

  async update(id, producto) {
    const response = await axios.put(`/productos/${id}`, producto);
    return response.data;
  }

  async delete(id) {
    const response = await axios.delete(`/productos/${id}`);
    return response.data;
  }

  async updateStock(id, cantidad) {
    const response = await axios.patch(`/productos/${id}/stock`, null, {
      params: { cantidad }
    });
    return response.data;
  }
}

export default new ProductService();
```

### Servicio de Órdenes

```javascript
// src/services/orderService.js
import axios from '../api/axiosConfig';

class OrderService {
  async getAll() {
    const response = await axios.get('/ordenes');
    return response.data;
  }

  async getById(id) {
    const response = await axios.get(`/ordenes/${id}`);
    return response.data;
  }

  async getByUser(usuarioId) {
    const response = await axios.get(`/ordenes/usuario/${usuarioId}`);
    return response.data;
  }

  async create(orderData) {
    const response = await axios.post('/ordenes', orderData);
    return response.data;
  }

  async updateStatus(id, estado) {
    const response = await axios.patch(`/ordenes/${id}/estado`, null, {
      params: { estado }
    });
    return response.data;
  }

  async cancel(id) {
    const response = await axios.delete(`/ordenes/${id}`);
    return response.data;
  }
}

export default new OrderService();
```

### Ejemplo de uso en componentes React

```javascript
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
```

```javascript
// src/pages/Productos.jsx
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="productos-container">
      <h2>Productos</h2>
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id} className="producto-card">
            <img src={producto.imagenUrl} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p className="precio">${producto.precio}</p>
            <button>Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 📱 Integración con React Native (Móvil)

### Configuración Firebase

```javascript
// src/config/firebase.js
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  ios: 'http://localhost:8080/api',
  android: 'http://10.0.2.2:8080/api',
});

export { auth, API_URL };
```

### Servicio de Autenticación con Firebase

```javascript
// src/services/authService.js
import { auth, API_URL } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async loginWithFirebase(email, password) {
    try {
      // Login con Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      
      // Sincronizar con backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.token) {
        await AsyncStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async registerWithFirebase(userData) {
    try {
      // Registrar en Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(
        userData.correo,
        userData.password
      );
      
      // Registrar en backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (data.token) {
        await AsyncStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await auth().signOut();
    await AsyncStorage.removeItem('user');
  }

  async getCurrentUser() {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

export default new AuthService();
```

### Servicio de API para Móvil

```javascript
// src/services/apiService.js
import { API_URL } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  async getAuthHeaders() {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    return {
      'Content-Type': 'application/json',
      ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
    };
  }

  async get(endpoint) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return response.json();
  }

  async post(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }
}

export default new ApiService();
```

### Ejemplo de Pantalla de Login en React Native

```javascript
// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import authService from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.loginWithFirebase(email, password);
      
      if (user.rol === 'ADMIN') {
        navigation.replace('AdminHome');
      } else {
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🔄 Variables de Entorno

### React (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
```

### React Native (.env)
```
API_URL_IOS=http://localhost:8080/api
API_URL_ANDROID=http://10.0.2.2:8080/api
```

## 📊 Estados de Orden

```javascript
const ORDER_STATUS = {
  PENDIENTE: 'PENDIENTE',
  PROCESANDO: 'PROCESANDO',
  ENVIADO: 'ENVIADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO'
};
```

## 🔒 Roles de Usuario

```javascript
const USER_ROLES = {
  USUARIO: 'USUARIO',
  ADMIN: 'ADMIN'
};
```

