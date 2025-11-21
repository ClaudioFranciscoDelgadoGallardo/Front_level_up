# Level Up - Sistema de Microservicios

Sistema completo de e-commerce con arquitectura de microservicios desarrollado con Spring Boot y PostgreSQL (Supabase).

## 📋 Arquitectura de Microservicios

### Microservicios Implementados

1. **API Gateway** (Puerto 8080)
   - Punto de entrada único para todas las peticiones
   - Enrutamiento a los diferentes microservicios
   - Configuración de CORS global

2. **Auth Service** (Puerto 8081)
   - Autenticación y autorización de usuarios
   - Generación y validación de tokens JWT
   - Login y registro de usuarios
   - Gestión de roles (USUARIO/ADMIN)

3. **User Service** (Puerto 8082)
   - Gestión completa de usuarios
   - CRUD de perfiles de usuario
   - Consulta de información de usuarios

4. **Product Service** (Puerto 8083)
   - Gestión de productos del catálogo
   - Búsqueda por categoría y nombre
   - Productos destacados
   - Control de stock

5. **Order Service** (Puerto 8084)
   - Gestión de órdenes de compra
   - Estados de orden (PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO)
   - Historial de órdenes por usuario
   - Detalles de orden

6. **Analytics Service** (Puerto 8085)
   - Análisis de logs y métricas
   - Estadísticas de ventas
   - Reportes de actividad

7. **Notification Service** (Puerto 8086)
   - Envío de notificaciones
   - Integración con Firebase (para app móvil)
   - Notificaciones por email

8. **File Service** (Puerto 8087)
   - Gestión de archivos e imágenes
   - Almacenamiento de imágenes de productos
   - Integración con Supabase Storage

## 🚀 Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Cloud Gateway**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL** (Supabase)
- **JWT** (JSON Web Tokens)
- **Lombok**
- **Maven**

## 📦 Configuración de Base de Datos

### Conexión a Supabase

Cada microservicio necesita configurar las siguientes variables de entorno:

```bash
DB_URL=jdbc:postgresql://<tu-proyecto>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=<tu-password>
JWT_SECRET=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough
```

### Estructura de Tablas

El sistema crea automáticamente las siguientes tablas:

- **usuarios**: Información de usuarios y credenciales
- **productos**: Catálogo de productos
- **ordenes**: Órdenes de compra
- **detalle_ordenes**: Detalles de cada orden

## 🔧 Instalación y Ejecución

### Pre-requisitos

- Java 17 o superior
- Maven 3.6+
- Cuenta en Supabase
- PostgreSQL (local o Supabase)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   cd "C:\Users\SoraR\OneDrive\Escritorio\Codigo\Front_level_up\Entrega EVA3"
   ```

2. **Configurar variables de entorno**
   
   Crear un archivo `.env` en cada carpeta de microservicio o configurar en el sistema:
   ```bash
   set DB_URL=jdbc:postgresql://tu-proyecto.supabase.co:5432/postgres?sslmode=require
   set DB_USERNAME=postgres
   set DB_PASSWORD=tu-password
   set JWT_SECRET=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough
   ```

3. **Compilar cada microservicio**
   ```bash
   # Auth Service
   cd LevelUp_Auth_service
   mvn clean install
   
   # User Service
   cd ..\LevelUp_User_service
   mvn clean install
   
   # Product Service
   cd ..\LevelUp_Product_service
   mvn clean install
   
   # Order Service
   cd ..\LevelUp_Order_service
   mvn clean install
   
   # API Gateway
   cd ..\LevelUp_Api_gateway
   mvn clean install
   ```

4. **Ejecutar los microservicios**
   
   Ejecutar en orden (en terminales separadas):
   
   ```bash
   # 1. Auth Service
   cd LevelUp_Auth_service
   mvn spring-boot:run
   
   # 2. User Service
   cd LevelUp_User_service
   mvn spring-boot:run
   
   # 3. Product Service
   cd LevelUp_Product_service
   mvn spring-boot:run
   
   # 4. Order Service
   cd LevelUp_Order_service
   mvn spring-boot:run
   
   # 5. API Gateway (último)
   cd LevelUp_Api_gateway
   mvn spring-boot:run
   ```

## 📡 API Endpoints

### Auth Service (Puerto 8081)

```
POST   /api/auth/register      - Registrar nuevo usuario
POST   /api/auth/login         - Iniciar sesión
POST   /api/auth/validate      - Validar token JWT
GET    /api/auth/health        - Estado del servicio
```

### Product Service (Puerto 8083)

```
GET    /api/productos                    - Obtener todos los productos activos
GET    /api/productos/destacados         - Obtener productos destacados
GET    /api/productos/{id}               - Obtener producto por ID
GET    /api/productos/categoria/{cat}    - Buscar por categoría
GET    /api/productos/buscar?nombre=x    - Buscar por nombre
POST   /api/productos                    - Crear producto (ADMIN)
PUT    /api/productos/{id}               - Actualizar producto (ADMIN)
DELETE /api/productos/{id}               - Eliminar producto (ADMIN)
PATCH  /api/productos/{id}/stock         - Actualizar stock
```

### Order Service (Puerto 8084)

```
GET    /api/ordenes                - Obtener todas las órdenes
GET    /api/ordenes/{id}           - Obtener orden por ID
GET    /api/ordenes/usuario/{id}   - Obtener órdenes de un usuario
POST   /api/ordenes                - Crear nueva orden
PATCH  /api/ordenes/{id}/estado    - Actualizar estado
DELETE /api/ordenes/{id}           - Cancelar orden
```

### API Gateway (Puerto 8080)

Todas las rutas anteriores también están disponibles a través del gateway:

```
http://localhost:8080/api/auth/**
http://localhost:8080/api/productos/**
http://localhost:8080/api/ordenes/**
```

## 🔐 Seguridad

### JWT Authentication

El sistema utiliza JWT para autenticación. Para acceder a endpoints protegidos:

1. Hacer login en `/api/auth/login`
2. Obtener el token del response
3. Incluir el token en las peticiones:
   ```
   Authorization: Bearer <token>
   ```

### Usuarios por Defecto

El sistema crea automáticamente:

- **Admin**: admin@levelup.cl / admin123
- **Usuario**: usuario@test.cl / user123

## 🌐 Integración con Frontend

### Para React (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Login
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Obtener productos
const getProductos = async () => {
  const response = await axios.get(`${API_URL}/productos`);
  return response.data;
};
```

### Para Firebase (App Móvil)

```javascript
import auth from '@react-native-firebase/auth';

// Autenticación con Firebase
const loginWithFirebase = async (email, password) => {
  await auth().signInWithEmailAndPassword(email, password);
  const token = await auth().currentUser.getIdToken();
  
  // Usar token para llamadas a API
  const response = await fetch('http://localhost:8080/api/productos', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## 📊 Estructura del Proyecto

```
Entrega EVA3/
├── LevelUp_Auth_service/           # Autenticación
│   ├── src/main/java/
│   │   └── levelup/levelup_auth_service/
│   │       ├── config/             # Configuraciones
│   │       ├── controller/         # Controladores REST
│   │       ├── dto/                # DTOs
│   │       ├── model/              # Entidades JPA
│   │       ├── repository/         # Repositorios
│   │       ├── security/           # JWT Utils
│   │       └── service/            # Lógica de negocio
│   └── src/main/resources/
│       └── application.properties
│
├── LevelUp_Product_service/        # Productos
├── LevelUp_Order_service/          # Órdenes
├── LevelUp_User_service/           # Usuarios
├── LevelUp_Api_gateway/            # Gateway
├── LevelUp_Analytics_service/      # Analytics
├── LevelUp_Notification_service/   # Notificaciones
└── LevelUp_File_service/           # Archivos
```

## 🐛 Troubleshooting

### Error de conexión a Supabase

Verificar:
1. URL de conexión correcta
2. Password correcto
3. SSL habilitado (`?sslmode=require`)
4. Certificado SSL en la carpeta correcta

### Puerto ya en uso

Cambiar el puerto en `application.properties`:
```properties
server.port=8081
```

### Error de JWT

Verificar que la clave secreta tenga al menos 256 bits (32 caracteres)

## 📝 Próximos Pasos

- [ ] Implementar Analytics Service
- [ ] Implementar Notification Service con Firebase
- [ ] Implementar File Service con Supabase Storage
- [ ] Agregar Config Service para configuración centralizada
- [ ] Implementar Circuit Breaker con Resilience4j
- [ ] Agregar Service Discovery con Eureka
- [ ] Implementar tests unitarios e integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Containerización con Docker
- [ ] CI/CD Pipeline

## 👥 Equipo de Desarrollo

- Desarrollador: Level Up Team
- Institución: DUOC UC

## 📄 Licencia

Este proyecto es parte de una evaluación académica.

