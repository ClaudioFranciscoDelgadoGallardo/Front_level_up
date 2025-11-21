# 🚀 INICIO RÁPIDO - Level Up Microservicios

## ⚡ Pasos para Iniciar en 5 Minutos

### 1️⃣ Configurar Supabase (2 minutos)

1. Ve a https://supabase.com y accede a tu proyecto
2. Ve a **Settings > Database**
3. Copia la **Connection String** (debería verse así):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

4. Edita el archivo `start-services.bat` y reemplaza estas líneas:

```batch
set DB_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres?sslmode=require
set DB_USERNAME=postgres
set DB_PASSWORD=TU-PASSWORD-AQUI
```

### 2️⃣ Compilar Todo (1 minuto)

Abre una terminal CMD en la carpeta del proyecto y ejecuta:

```cmd
build-all.bat
```

Espera a que compile todos los servicios. Verás mensajes como:
```
[1/5] Compilando Auth Service...
[2/5] Compilando User Service...
...
Compilación completada exitosamente!
```

### 3️⃣ Iniciar Servicios (30 segundos)

Ejecuta:

```cmd
start-services.bat
```

Se abrirán 5 ventanas de terminal, una para cada servicio. Espera 30-60 segundos hasta que veas:
```
Started LevelUpAuthServiceApplication
Started LevelUpProductServiceApplication
...
```

### 4️⃣ Probar que Funciona (30 segundos)

Abre tu navegador en:

**Health Checks:**
- http://localhost:8081/api/auth/health
- http://localhost:8083/api/productos/health
- http://localhost:8084/api/ordenes/health

**Login de prueba:**
- Abre Postman o tu cliente REST favorito
- POST a `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@levelup.cl",
  "password": "admin123"
}
```

Deberías recibir:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "id": 1,
  "nombre": "Admin",
  "apellidos": "Level Up",
  "correo": "admin@levelup.cl",
  "rol": "ADMIN",
  "mensaje": "Inicio de sesión exitoso"
}
```

### 5️⃣ Ver Productos (30 segundos)

En tu navegador:
- http://localhost:8080/api/productos

¡Listo! 🎉

---

## 🔧 Solución de Problemas Rápida

### ❌ Error: "Connection refused" al compilar

**Problema:** No se puede conectar a Supabase

**Solución:**
1. Verifica que tu URL de Supabase sea correcta
2. Verifica que el password sea correcto
3. Asegúrate de tener `?sslmode=require` al final de la URL

---

### ❌ Error: "Port 8081 already in use"

**Problema:** El puerto ya está siendo usado

**Solución:**
```cmd
# Detener todos los servicios
stop-services.bat

# O manualmente:
netstat -ano | findstr :8081
taskkill /F /PID <número-del-proceso>
```

---

### ❌ Error: "JAVA_HOME not set"

**Problema:** Java no está configurado

**Solución:**
1. Descarga Java 17: https://adoptium.net/
2. Instala Java 17
3. Configura JAVA_HOME:
```cmd
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot"
```
4. Cierra y abre la terminal nuevamente

---

### ❌ No aparecen productos

**Problema:** La base de datos está vacía

**Solución:**
Crea productos manualmente con Postman:

POST a `http://localhost:8080/api/productos`

Body (JSON):
```json
{
  "nombre": "Mouse Gamer RGB",
  "descripcion": "Mouse gaming profesional",
  "precio": 29990,
  "categoria": "Periféricos",
  "stock": 50,
  "imagenUrl": "https://picsum.photos/300/300",
  "destacado": true,
  "marca": "Logitech",
  "descuento": 0
}
```

---

## 📱 Integrar con tu Frontend

### React

```javascript
// Instala axios
npm install axios

// Crea src/api/axiosConfig.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

export default API;

// Úsalo en tus componentes
import API from './api/axiosConfig';

const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const getProductos = async () => {
  const response = await API.get('/productos');
  return response.data;
};
```

### React Native

```javascript
// Instala async-storage
npm install @react-native-async-storage/async-storage

// Configura la API
const API_URL = Platform.select({
  ios: 'http://localhost:8080/api',
  android: 'http://10.0.2.2:8080/api',
});

// Úsalo
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  await AsyncStorage.setItem('user', JSON.stringify(data));
  return data;
};
```

---

## 📚 Recursos Adicionales

| Documento | Descripción |
|-----------|-------------|
| `README_MICROSERVICIOS.md` | Documentación completa del sistema |
| `CONFIGURACION_SUPABASE.md` | Guía detallada de Supabase |
| `INTEGRACION_FRONTEND.md` | Ejemplos de integración completos |
| `RESUMEN_COMPLETO.md` | Resumen de todo lo implementado |
| `LevelUp_Postman_Collection.json` | Colección de Postman para pruebas |

---

## 🎯 Próximos Pasos

1. ✅ Probar todos los endpoints con Postman
2. ✅ Crear algunos productos de prueba
3. ✅ Integrar con tu frontend React
4. ✅ Configurar Firebase para la app móvil
5. ⏳ Implementar los servicios adicionales (Analytics, Notifications, Files)

---

## 🆘 ¿Necesitas Ayuda?

### Servicios están corriendo pero no responden

```cmd
# Verifica que los puertos estén escuchando
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8083
netstat -ano | findstr :8084
```

### Ver los logs de un servicio

Los logs aparecen en las ventanas de terminal que se abrieron. Si cerraste alguna, vuelve a iniciar el servicio:

```cmd
cd LevelUp_Auth_service
mvn spring-boot:run
```

### Reiniciar todo desde cero

```cmd
# 1. Detener todos los servicios
stop-services.bat

# 2. Limpiar y recompilar
cd LevelUp_Auth_service
mvn clean

cd ..\LevelUp_Product_service
mvn clean

cd ..\LevelUp_Order_service
mvn clean

cd ..\LevelUp_Api_gateway
mvn clean

cd ..

# 3. Volver a compilar e iniciar
build-all.bat
start-services.bat
```

---

## ✨ Características Disponibles

- ✅ **Login/Register** - Autenticación completa con JWT
- ✅ **Gestión de Productos** - CRUD completo
- ✅ **Órdenes de Compra** - Sistema completo de pedidos
- ✅ **Roles** - ADMIN y USUARIO
- ✅ **Búsqueda** - Por nombre y categoría
- ✅ **Stock** - Control automático
- ✅ **API Gateway** - Punto de entrada centralizado
- ✅ **CORS** - Configurado para frontend
- ✅ **SSL** - Conexión segura a Supabase

---

## 🎉 ¡Estás Listo!

Tu sistema de microservicios Level Up está completamente funcional y listo para:

1. Conectar tu frontend React
2. Conectar tu app móvil React Native
3. Desarrollar nuevas funcionalidades
4. Hacer deploy a producción

**Usuarios de prueba disponibles:**
- Admin: `admin@levelup.cl` / `admin123`
- Usuario: `usuario@test.cl` / `user123`

**Endpoints principales:**
- API Gateway: http://localhost:8080
- Auth: http://localhost:8081
- Products: http://localhost:8083
- Orders: http://localhost:8084

¡Mucho éxito con tu proyecto! 🚀

