# 📋 ESTÁNDARES DEL PROYECTO LEVEL UP

**Fecha de estandarización:** 25 de noviembre de 2025  
**Base de estandarización:** User Service

---

## 🎯 ESTÁNDARES GENERALES

### **1. Nomenclatura de Campos**

| Campo | Nombre Estándar | Tipo |
|-------|----------------|------|
| Email/Correo | `correo` | String |
| Contraseña | `password` | String |
| RUN | `run` | String |
| Rol | `rol` | String |
| Fecha de Nacimiento | `fechaNacimiento` | LocalDate |

### **2. Validaciones de DTOs**

#### **LoginRequest (Auth y User Service)**
```java
@NotBlank(message = "El correo es obligatorio")
@Email(message = "Formato de correo invalido")
private String correo;

@NotBlank(message = "La contrasena es obligatoria")
@Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
private String password;
```

#### **RegisterRequest / RegistroRequest**
```java
@NotBlank(message = "El RUN es obligatorio")
@Pattern(regexp = "^\\d{7,8}-[0-9Kk]$", message = "Formato de RUN invalido")
private String run;

@NotBlank(message = "El nombre es obligatorio")
@Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
private String nombre;

@NotBlank(message = "Los apellidos son obligatorios")
@Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
private String apellidos;

@NotBlank(message = "El correo es obligatorio")
@Email(message = "Formato de correo invalido")
private String correo;

@NotBlank(message = "La contrasena es obligatoria")
@Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
private String password;

@Pattern(regexp = "^[0-9]{9}$", message = "El telefono debe tener 9 digitos")
private String telefono;
```

### **3. Validación de Edad**

**OBLIGATORIO:** Validar que el usuario sea mayor de 18 años

```java
// En el Service, método de registro:
if (request.getFechaNacimiento() != null) {
    LocalDate fechaNac = request.getFechaNacimiento();
    int edad = Period.between(fechaNac, LocalDate.now()).getYears();
    if (edad < 18) {
        throw new RuntimeException("Debes ser mayor de 18 años para registrarte");
    }
}
```

### **4. Roles de Usuario**

**Formato:** Mayúsculas (String)

```java
public enum RolUsuario {
    CLIENTE,    // Usuario cliente predeterminado
    ADMIN,      // Administrador
    VENDEDOR,   // Vendedor
    BODEGUERO   // Bodeguero
}
```

**Valor predeterminado:** `"CLIENTE"`

### **5. Modelo Usuario Estándar**

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 12)
    private String run;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(unique = true, nullable = false, length = 255)
    private String correo;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 15)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(length = 100)
    private String comuna;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String region;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(nullable = false, length = 20)
    private String rol = "CLIENTE";

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean verificado = false;

    @Column(name = "token_verificacion", length = 255)
    private String tokenVerificacion;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "intentos_fallidos")
    private Integer intentosFallidos = 0;

    @Column(name = "bloqueado_hasta")
    private LocalDateTime bloqueadoHasta;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Enum y métodos auxiliares
    public enum RolUsuario {
        CLIENTE, ADMIN, VENDEDOR, BODEGUERO
    }

    public RolUsuario getRolEnum() {
        return RolUsuario.valueOf(rol);
    }

    public void setRolEnum(RolUsuario rolUsuario) {
        this.rol = rolUsuario.name();
    }

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
```

---

## 📝 MENSAJES DE ERROR ESTÁNDAR

**Regla:** Sin tildes en los mensajes de validación

| Campo | Mensaje |
|-------|---------|
| Correo vacío | "El correo es obligatorio" |
| Correo inválido | "Formato de correo invalido" |
| Contraseña vacía | "La contrasena es obligatoria" |
| Contraseña corta | "La contrasena debe tener al menos 6 caracteres" |
| RUN vacío | "El RUN es obligatorio" |
| RUN inválido | "Formato de RUN invalido" |
| Nombre vacío | "El nombre es obligatorio" |
| Apellidos vacíos | "Los apellidos son obligatorios" |
| Teléfono inválido | "El telefono debe tener 9 digitos" |
| Edad menor | "Debes ser mayor de 18 años para registrarte" |

---

## 🔐 USUARIOS DE PRUEBA ESTÁNDAR

**Todos los servicios deben tener estos 3 usuarios:**

### **1. Admin**
```java
run: "11111111-1"
nombre: "Admin"
apellidos: "Level Up"
correo: "admin@levelup.cl"
password: "admin123"
telefono: "+56912345678"
direccion: "Av. Principal 123"
comuna: "Santiago"
ciudad: "Santiago"
region: "Región Metropolitana"
codigoPostal: "8320000"
fechaNacimiento: LocalDate.of(1990, 1, 1)
rol: "ADMIN"
activo: true
verificado: true
intentosFallidos: 0
```

### **2. Cliente**
```java
run: "22222222-2"
nombre: "Usuario"
apellidos: "Prueba"
correo: "usuario@test.cl"
password: "user123"
telefono: "+56987654321"
direccion: "Calle Secundaria 456"
comuna: "Providencia"
ciudad: "Santiago"
region: "Región Metropolitana"
codigoPostal: "7500000"
fechaNacimiento: LocalDate.of(1995, 6, 15)
rol: "CLIENTE"
activo: true
verificado: true
intentosFallidos: 0
```

### **3. Vendedor**
```java
run: "33333333-3"
nombre: "Vendedor"
apellidos: "Level Up"
correo: "vendedor@levelup.cl"
password: "vendedor123"
telefono: "+56911111111"
direccion: "Oficina Central"
comuna: "Las Condes"
ciudad: "Santiago"
region: "Región Metropolitana"
codigoPostal: "7550000"
fechaNacimiento: LocalDate.of(1988, 3, 20)
rol: "VENDEDOR"
activo: true
verificado: true
intentosFallidos: 0
```

---

## 🗄️ BASE DE DATOS

### **Configuración Supabase Estándar**

```properties
spring.datasource.url=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
spring.datasource.username=postgres.xsgpfadjkjgbnnxgnqhp
spring.datasource.password=Levelup123.
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=600000
```

### **JWT Estándar**

```properties
jwt.secret=LevelUpSecretKeyForJWTTokenGeneration2024ThisKeyMustBeLongEnoughForHS512AlgorithmRequirements
jwt.expiration=86400000
```

**Longitud:** 96 caracteres  
**Algoritmo:** HS512  
**Expiración:** 24 horas (86400000 ms)

---

## 🚀 PUERTOS DE SERVICIOS

| Servicio | Puerto |
|----------|--------|
| API Gateway | 8080 |
| Auth Service | 8081 |
| User Service | 8082 |
| Product Service | 8083 |
| Order Service | 8084 |
| Analytics Service | 8085 |
| Notification Service | 8086 |
| File Service | 8087 |
| Config Service | 8888 |

---

## 📋 REGLAS DE VALIDACIÓN

### **RUN (Cédula chilena)**
- **Formato:** `\d{7,8}-[0-9Kk]`
- **Ejemplo válido:** `12345678-9`, `1234567-K`
- **Pattern:** `^\\d{7,8}-[0-9Kk]$`

### **Correo**
- **Validación:** `@Email` de Jakarta
- **Formato:** email@domain.com

### **Contraseña**
- **Mínimo:** 6 caracteres
- **Máximo:** Sin límite
- **Validación:** `@Size(min = 6)`

### **Teléfono**
- **Formato:** 9 dígitos
- **Pattern:** `^[0-9]{9}$`
- **Ejemplo:** `912345678`

### **Edad**
- **Mínima:** 18 años
- **Cálculo:** `Period.between(fechaNac, LocalDate.now()).getYears()`

---

## ✅ CHECKLIST DE ESTANDARIZACIÓN

Para cada microservicio, verificar:

- [ ] DTOs usan `correo` (no `email`)
- [ ] Validación de contraseña: `@Size(min = 6)`
- [ ] RUN con `@Pattern(regexp = "^\\d{7,8}-[0-9Kk]$")`
- [ ] Mensajes sin tildes: "contrasena", "invalido"
- [ ] Roles en mayúsculas: CLIENTE, ADMIN, VENDEDOR, BODEGUERO
- [ ] Validación de edad 18+ en registro
- [ ] 3 usuarios de prueba (admin, cliente, vendedor)
- [ ] Conexión a Supabase configurada
- [ ] Pool de conexiones HikariCP: max 5
- [ ] JWT secret de 96 caracteres
- [ ] Puerto correcto asignado
- [ ] Health endpoint: `/api/{servicio}/health`

---

## 🔄 SERVICIOS ESTANDARIZADOS

- ✅ **User Service** (Puerto 8082) - BASE DE ESTANDARIZACIÓN
- ✅ **Auth Service** (Puerto 8081) - ESTANDARIZADO
- ⏳ **Product Service** (Puerto 8083)
- ⏳ **Order Service** (Puerto 8084)
- ⏳ **Analytics Service** (Puerto 8085)
- ⏳ **Notification Service** (Puerto 8086)
- ⏳ **File Service** (Puerto 8087)
- ⏳ **Config Service** (Puerto 8888)
- ⏳ **API Gateway** (Puerto 8080)

---

## 📚 DOCUMENTACIÓN

- `GUIA_POSTMAN_COMPLETA.md` - Guía completa de endpoints
- `LevelUp_Postman_Collection.json` - Colección importable
- `README_MICROSERVICIOS.md` - Documentación técnica
- `ESTANDARES_PROYECTO.md` - Este documento

---

**Última actualización:** 25/11/2025  
**Responsable:** GitHub Copilot  
**Estado:** ✅ Estándares definidos - En proceso de aplicación
