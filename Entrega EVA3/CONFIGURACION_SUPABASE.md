# ========================================
# Level Up - Configuracion de Supabase
# ========================================

## Instrucciones de Configuracion

### 1. Obtener credenciales de Supabase

1. Ve a https://supabase.com
2. Accede a tu proyecto
3. Ve a Settings > Database
4. Copia la cadena de conexión

### 2. Configurar variables de entorno

Opcion A - Variables de sistema (Recomendado):
```cmd
setx DB_URL "jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require"
setx DB_USERNAME "postgres"
setx DB_PASSWORD "tu-password-aqui"
setx JWT_SECRET "LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough"
```

Opcion B - Archivo .env (requiere spring-boot-dotenv):
Crear archivo .env en la raiz de cada microservicio:
```
DB_URL=jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=tu-password-aqui
JWT_SECRET=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough
```

Opcion C - Directamente en application.properties:
```properties
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=tu-password-aqui
jwt.secret=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough
```

### 3. Configuracion SSL

El certificado SSL de Supabase esta en: 
`CertificacionSupaBase/prod-ca-2021.crt`

Para usar el certificado (opcional, ya que usamos sslmode=require):

1. Importar el certificado al Java KeyStore:
```cmd
keytool -importcert -alias supabase-ca -file CertificacionSupaBase\prod-ca-2021.crt -keystore %JAVA_HOME%\lib\security\cacerts -storepass changeit
```

2. O especificar en application.properties:
```properties
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres?ssl=true&sslmode=require&sslrootcert=../CertificacionSupaBase/prod-ca-2021.crt
```

### 4. Verificar conexion

Ejecuta el siguiente comando para verificar:
```cmd
cd LevelUp_Auth_service
mvn spring-boot:run
```

Si ves "Started LevelUpAuthServiceApplication" sin errores, la conexion es exitosa.

### 5. Formato de URL de conexion

Formato completo:
```
jdbc:postgresql://[HOST]:[PORT]/[DATABASE]?sslmode=require

Ejemplo real:
jdbc:postgresql://db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
```

### 6. Puertos de los servicios

- API Gateway:     8080
- Auth Service:    8081
- User Service:    8082
- Product Service: 8083
- Order Service:   8084
- Analytics:       8085
- Notification:    8086
- File Service:    8087

### 7. Usuarios por defecto

El sistema crea automaticamente:
- Admin: admin@levelup.cl / admin123
- Usuario: usuario@test.cl / user123

### 8. Endpoints de prueba

Auth Service:
POST http://localhost:8081/api/auth/login
{
  "email": "admin@levelup.cl",
  "password": "admin123"
}

Product Service:
GET http://localhost:8083/api/productos

Order Service:
GET http://localhost:8084/api/ordenes

API Gateway (acceso centralizado):
POST http://localhost:8080/api/auth/login
GET http://localhost:8080/api/productos
GET http://localhost:8080/api/ordenes

### 9. Troubleshooting

Error: "Connection refused"
- Verificar que Supabase este activo
- Verificar URL de conexion
- Verificar firewall

Error: "Authentication failed"
- Verificar password
- Verificar usuario (debe ser 'postgres')

Error: "SSL required"
- Agregar ?sslmode=require a la URL

Error: "Port already in use"
- Cambiar puerto en application.properties
- O detener servicio existente: netstat -ano | findstr :8081

