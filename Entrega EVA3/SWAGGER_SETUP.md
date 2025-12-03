# 🚀 Implementación de Swagger/OpenAPI en Level Up

## ✅ Lo que se ha configurado

### 1. **Dependencias agregadas**
- **User Service**: `springdoc-openapi-starter-webmvc-ui` v2.6.0
- **API Gateway**: `springdoc-openapi-starter-webflux-ui` v2.6.0

### 2. **Configuraciones creadas**
- `OpenApiConfig.java` en User Service
- `OpenApiConfig.java` en API Gateway
- Propiedades de Springdoc en `application.properties`
- Seguridad configurada para permitir acceso a Swagger sin autenticación

---

## 🔧 Pasos para activar Swagger

### **Paso 1: Recompilar User Service**
```powershell
cd LevelUp_User_service
.\mvnw.cmd clean package -DskipTests
```

### **Paso 2: Recompilar API Gateway**
```powershell
cd ..\LevelUp_Api_gateway
.\mvnw.cmd clean package -DskipTests
```

### **Paso 3: Reiniciar servicios Docker**
```powershell
cd ..
docker-compose restart levelup_user levelup_gateway
```

O si prefieres reiniciar todo:
```powershell
docker-compose down
docker-compose up -d
```

---

## 🌐 URLs de acceso a Swagger

### **Opción 1: Directamente en cada servicio**

#### User Service (puerto 8082)
- **Swagger UI**: http://localhost:8082/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8082/v3/api-docs

#### Product Service (puerto 8083)
- **Swagger UI**: http://localhost:8083/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8083/v3/api-docs

#### Order Service (puerto 8084)
- **Swagger UI**: http://localhost:8084/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8084/v3/api-docs

---

### **Opción 2: A través del Gateway (RECOMENDADO)**

#### Gateway consolidado (puerto 8080)
- **Swagger UI**: http://localhost:8080/swagger-ui.html
  - Aquí verás todos los servicios en un solo lugar
  - Selector desplegable arriba a la derecha para cambiar entre servicios

#### Endpoints a través del Gateway:
- User Service: http://localhost:8080/api/usuarios/swagger-ui.html
- Product Service: http://localhost:8080/api/productos/swagger-ui.html
- Order Service: http://localhost:8080/api/ordenes/swagger-ui.html

---

## 🧪 Cómo probar

### **1. Verificar que User Service está corriendo con Swagger**
```powershell
Invoke-WebRequest -Uri "http://localhost:8082/v3/api-docs" | Select-Object StatusCode, Content
```

Deberías ver `StatusCode: 200` y un JSON con la especificación OpenAPI.

### **2. Abrir Swagger UI en el navegador**
```
http://localhost:8082/swagger-ui.html
```

### **3. Probar un endpoint público**
1. En Swagger UI, expande **UsuarioController**
2. Busca `POST /api/usuarios/login`
3. Click en **"Try it out"**
4. Ingresa credenciales:
   ```json
   {
     "correo": "admin@levelup.cl",
     "password": "admin123"
   }
   ```
5. Click **"Execute"**
6. Verás la respuesta con el token JWT

### **4. Probar endpoints protegidos**
1. Copia el token de la respuesta de login
2. Click en el botón **"Authorize"** (candado verde arriba a la derecha)
3. Ingresa: `Bearer <tu-token-aqui>`
4. Click **"Authorize"**
5. Ahora puedes probar endpoints protegidos como `GET /api/usuarios`

---

## 📦 Para agregar Swagger a otros servicios

### **Paso 1: Agregar dependencia al pom.xml**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

### **Paso 2: Crear OpenApiConfig.java**
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI productServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("LevelUp - Product Service API")
                .description("API para gestión de productos")
                .version("1.0.0"));
    }
}
```

### **Paso 3: Configurar application.properties**
```properties
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
```

### **Paso 4: Actualizar SecurityConfig (si tiene seguridad)**
```java
.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
```

### **Paso 5: Registrar en el Gateway**
Agregar en `application.properties` del Gateway:
```properties
springdoc.swagger-ui.urls[X].name=Product Service
springdoc.swagger-ui.urls[X].url=/api/productos/v3/api-docs
```

---

## 🎨 Personalización avanzada

### **Agregar descripción a endpoints con anotaciones**
```java
@Operation(
    summary = "Registrar nuevo usuario",
    description = "Crea un nuevo usuario en el sistema con rol CLIENTE por defecto"
)
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
    @ApiResponse(responseCode = "409", description = "Correo ya registrado")
})
@PostMapping("/registro")
public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {
    // ...
}
```

### **Documentar parámetros**
```java
@Parameter(description = "ID del usuario", example = "1", required = true)
@PathVariable Long id
```

### **Documentar modelos**
```java
@Schema(description = "Solicitud de registro de usuario")
public class RegistroRequest {
    
    @Schema(description = "Correo electrónico", example = "usuario@example.com", required = true)
    private String correo;
    
    @Schema(description = "Contraseña (mínimo 8 caracteres)", example = "Password123!", required = true)
    private String password;
}
```

---

## 🐛 Troubleshooting

### **Error: Cannot access /swagger-ui.html**
- Verifica que el servicio esté corriendo: `docker ps`
- Verifica los logs: `docker logs levelup_user`
- Asegúrate de haber recompilado después de agregar las dependencias

### **Error: 403 Forbidden en Swagger UI**
- Verifica que SecurityConfig permita acceso a `/swagger-ui/**`
- Revisa que DisableCorsFilter esté activo en el Gateway

### **Swagger UI no muestra los endpoints**
- Verifica que el controlador tenga `@RestController` y `@RequestMapping`
- Revisa que los métodos tengan anotaciones `@GetMapping`, `@PostMapping`, etc.
- Comprueba el JSON en `/v3/api-docs`

### **Gateway no muestra todos los servicios**
- Verifica las rutas en `application.properties` del Gateway
- Asegúrate de que cada servicio exponga `/v3/api-docs`
- Reinicia el Gateway después de cambios

---

## 📚 Documentación oficial
- **Springdoc**: https://springdoc.org/
- **OpenAPI 3.0**: https://swagger.io/specification/
- **Swagger UI**: https://swagger.io/tools/swagger-ui/

---

## ✨ Beneficios de Swagger
✅ Documentación automática desde el código  
✅ UI interactiva para probar endpoints  
✅ Generación de clientes en múltiples lenguajes  
✅ Validación de contratos API  
✅ Facilita la colaboración entre frontend y backend  
✅ Totalmente gratuito y open source  

---

**Siguiente paso**: Recompila y prueba abriendo http://localhost:8082/swagger-ui.html 🚀
