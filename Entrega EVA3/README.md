# 🎮 Level Up - Sistema de Microservicios

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue)
![Status](https://img.shields.io/badge/Status-Producción%20Ready-success)

**Sistema completo de e-commerce con arquitectura de microservicios**

[Inicio Rápido](#-inicio-rápido) • [Documentación](#-documentación) • [API](#-api) • [Configuración](#️-configuración)

</div>

---

## 📋 Descripción

Level Up es un sistema completo de comercio electrónico desarrollado con arquitectura de microservicios usando Spring Boot. Diseñado para ser escalable, mantenible y fácil de integrar con aplicaciones web (React) y móviles (React Native).

### ✨ Características Principales

- 🔐 **Autenticación JWT** - Sistema completo de login y registro
- 🛍️ **Gestión de Productos** - CRUD completo con búsqueda y filtros
- 📦 **Sistema de Órdenes** - Gestión completa de pedidos
- 🌐 **API Gateway** - Punto de entrada centralizado
- 👥 **Roles de Usuario** - Administradores y usuarios regulares
- 💾 **Base de Datos** - PostgreSQL con Supabase
- 🔒 **Seguridad** - SSL/TLS, encriptación de passwords, validaciones
- 📱 **Multi-plataforma** - Compatible con web y móvil

---

## 🏗️ Arquitectura

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│  React Web  │───▶│   API Gateway   │◀───│ React Native│
└─────────────┘    │   (Puerto 8080) │    └─────────────┘
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐        ┌─────▼─────┐      ┌────▼─────┐
   │  Auth   │        │  Product  │      │  Order   │
   │ Service │        │  Service  │      │ Service  │
   │  :8081  │        │   :8083   │      │  :8084   │
   └────┬────┘        └─────┬─────┘      └────┬─────┘
        └───────────────────┼─────────────────┘
                            │
                     ┌──────▼──────┐
                     │  PostgreSQL │
                     │  (Supabase) │
                     └─────────────┘
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- Cuenta en [Supabase](https://supabase.com)

### 1. Clonar el repositorio

```bash
cd "C:\Users\SoraR\OneDrive\Escritorio\Codigo\Front_level_up\Entrega EVA3"
```

### 2. Configurar Supabase

Edita `start-services.bat` y configura tus credenciales:

```batch
set DB_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres?sslmode=require
set DB_USERNAME=postgres
set DB_PASSWORD=TU-PASSWORD-AQUI
```

### 3. Compilar

```cmd
build-all.bat
```

### 4. Iniciar servicios

```cmd
start-services.bat
```

### 5. Probar

Abre tu navegador en: http://localhost:8080/api/auth/health

¡Listo! 🎉

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [**INICIO_RAPIDO.md**](INICIO_RAPIDO.md) | Guía de inicio en 5 minutos ⚡ |
| [**README_MICROSERVICIOS.md**](README_MICROSERVICIOS.md) | Documentación técnica completa 📖 |
| [**RESUMEN_COMPLETO.md**](RESUMEN_COMPLETO.md) | Resumen de implementación 📋 |
| [**CONFIGURACION_SUPABASE.md**](CONFIGURACION_SUPABASE.md) | Configuración de base de datos 🗄️ |
| [**INTEGRACION_FRONTEND.md**](INTEGRACION_FRONTEND.md) | Ejemplos de integración 🌐 |
| [**INDICE_COMPLETO.md**](INDICE_COMPLETO.md) | Índice del proyecto 📑 |

---

## 🔌 API

### Endpoints Principales

**Autenticación**
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/validate
```

**Productos**
```http
GET    /api/productos
GET    /api/productos/destacados
GET    /api/productos/{id}
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}
```

**Órdenes**
```http
GET    /api/ordenes
GET    /api/ordenes/{id}
POST   /api/ordenes
PATCH  /api/ordenes/{id}/estado
```

📦 **Importa la colección de Postman:** [LevelUp_Postman_Collection.json](LevelUp_Postman_Collection.json)

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DB_URL=jdbc:postgresql://tu-proyecto.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=tu-password
JWT_SECRET=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough
```

### Usuarios por Defecto

| Email | Password | Rol |
|-------|----------|-----|
| admin@levelup.cl | admin123 | ADMIN |
| usuario@test.cl | user123 | USUARIO |

---

## 🛠️ Tecnologías

<table>
<tr>
<td>

**Backend**
- Spring Boot 3.5.7
- Spring Security
- Spring Data JPA
- Spring Cloud Gateway
- JWT (jjwt)
- PostgreSQL

</td>
<td>

**Herramientas**
- Maven
- Lombok
- Supabase
- Postman
- Git

</td>
</tr>
</table>

---

## 📦 Microservicios

| Servicio | Puerto | Estado | Descripción |
|----------|--------|--------|-------------|
| **API Gateway** | 8080 | ✅ | Punto de entrada centralizado |
| **Auth Service** | 8081 | ✅ | Autenticación y autorización |
| **User Service** | 8082 | 🔧 | Gestión de usuarios |
| **Product Service** | 8083 | ✅ | Gestión de productos |
| **Order Service** | 8084 | ✅ | Gestión de órdenes |
| **Analytics Service** | 8085 | ⏳ | Análisis y métricas |
| **Notification Service** | 8086 | ⏳ | Notificaciones |
| **File Service** | 8087 | ⏳ | Gestión de archivos |

---

## 🧪 Testing

### Con Postman

1. Importa `LevelUp_Postman_Collection.json`
2. Ejecuta la petición de login
3. Copia el token recibido
4. Úsalo en las demás peticiones

### Con cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@levelup.cl","password":"admin123"}'

# Obtener productos
curl http://localhost:8080/api/productos
```

---

## 🌐 Integración Frontend

### React (Web)

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Login
const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

// Productos
const getProductos = async () => {
  const response = await API.get('/productos');
  return response.data;
};
```

### React Native (Móvil)

```javascript
const API_URL = 'http://10.0.2.2:8080/api'; // Android
// const API_URL = 'http://localhost:8080/api'; // iOS

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

Ver más ejemplos en [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md)

---

## 🐛 Troubleshooting

### No se puede conectar a Supabase
- ✅ Verifica que la URL sea correcta
- ✅ Verifica que incluya `?sslmode=require`
- ✅ Verifica el password

### Puerto ya en uso
```cmd
stop-services.bat
```

### Maven no encuentra dependencias
```cmd
cd LevelUp_Auth_service
mvn clean install -U
```

---

## 📊 Estado del Proyecto

- ✅ **Auth Service** - Completado y funcional
- ✅ **Product Service** - Completado y funcional
- ✅ **Order Service** - Completado y funcional
- ✅ **API Gateway** - Completado y funcional
- 🔧 **User Service** - En desarrollo
- ⏳ **Analytics Service** - Planeado
- ⏳ **Notification Service** - Planeado
- ⏳ **File Service** - Planeado

---

## 🤝 Contribuir

Este es un proyecto académico de DUOC UC. Para contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es parte de una evaluación académica de DUOC UC.

---

## 👥 Equipo

- **Proyecto:** Level Up E-commerce
- **Institución:** DUOC UC
- **Evaluación:** EVA3
- **Año:** 2025

---

## 📞 Soporte

¿Tienes problemas? Consulta:

1. [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guía rápida
2. [README_MICROSERVICIOS.md](README_MICROSERVICIOS.md) - Documentación completa
3. [CONFIGURACION_SUPABASE.md](CONFIGURACION_SUPABASE.md) - Configuración de BD

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella ⭐**

[Inicio](#-level-up---sistema-de-microservicios) • [Documentación](#-documentación) • [API](#-api)

</div>

