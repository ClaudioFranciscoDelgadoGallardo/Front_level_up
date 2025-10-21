# Level-Up Gamer

Tienda online de productos gaming desarrollada con React. Este proyecto es una migración completa desde una aplicación web tradicional (HTML/CSS/JavaScript) hacia una arquitectura moderna con React y Context API.

## Descripción

Level-Up Gamer es una plataforma de e-commerce especializada en productos gaming que incluye consolas, accesorios, juegos de mesa y PCs gaming. La aplicación permite a los usuarios navegar por el catálogo, agregar productos al carrito y realizar compras. También cuenta con un panel de administración completo para gestionar productos y usuarios.

## Características principales

**Para usuarios:**
- Catálogo de productos con información detallada
- Sistema de carrito de compras con cálculo automático de totales
- Descuento del 20% para correos institucionales (@duoc.cl)
- Registro de nuevos usuarios
- Inicio de sesión con validación
- Página de detalle individual para cada producto
- Notificaciones visuales personalizadas

**Para administradores:**
- Panel de administración protegido
- Gestión completa de productos (crear, editar, eliminar)
- Gestión de usuarios del sistema
- Búsqueda y filtrado de registros

## Tecnologías utilizadas

- React 18.2.0
- React Router DOM para navegación
- Context API para manejo de estado global
- Bootstrap 5.3.8 para estilos
- LocalStorage para persistencia de datos
- Google Fonts (Orbitron y Roboto)

## Instalación y configuración

### Requisitos previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos para ejecutar el proyecto

1. Clonar el repositorio o descargar los archivos del proyecto

2. Abrir una terminal en la carpeta del proyecto

3. Instalar las dependencias:
```bash
npm install
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

5. Abrir el navegador en [http://localhost:3000](http://localhost:3000)

La aplicación se recargará automáticamente cuando hagas cambios en el código.

## Usuarios de prueba

El sistema incluye dos usuarios predefinidos para facilitar las pruebas:

**Cuenta de administrador:**
- Correo: admin@levelup.cl
- Contraseña: admin123
- Permisos: Acceso completo al panel de administración

**Cuenta de usuario regular:**
- Correo: usuario@levelup.cl
- Contraseña: user123
- Permisos: Compra de productos

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.js       # Barra de navegación y carrito
│   ├── Footer.js       # Pie de página
│   └── Notificacion.js # Sistema de notificaciones
├── pages/              # Páginas de la aplicación
│   ├── Home.js         # Página principal
│   ├── Productos.js    # Catálogo de productos
│   ├── Detalle.js      # Detalle de producto
│   ├── Carrito.js      # Carrito de compras
│   ├── Login.js        # Inicio de sesión
│   ├── Registro.js     # Registro de usuarios
│   └── Admin*.js       # Páginas del panel admin
├── context/            # Context API
│   └── CarritoContext.js
├── styles/             # Archivos CSS
└── utils/              # Funciones auxiliares
    └── inicializarDatos.js
```

## Funcionalidades destacadas

### Sistema de carrito
El carrito mantiene la información de los productos agregados incluso al cerrar el navegador gracias a localStorage. Calcula automáticamente subtotales, descuentos y el total final.

### Validaciones de formularios
Todos los formularios cuentan con validaciones en JavaScript sin depender de las validaciones nativas del navegador. Los mensajes de error se muestran mediante notificaciones personalizadas.

### Panel de administración
Accesible únicamente para usuarios con rol de administrador. Permite gestionar tanto productos como usuarios del sistema, con funciones de búsqueda para facilitar la navegación entre muchos registros.

---

Este proyecto fue creado con [Create React App](https://github.com/facebook/create-react-app).

## Comandos disponibles

### Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm start
```
Esto abrirá la aplicación en http://localhost:3000 y se recargará automáticamente cuando realices cambios.

### Construcción para producción

Para crear una versión optimizada del proyecto:
```bash
npm run build
```
Esto generará una carpeta `build` con los archivos estáticos listos para desplegar en un servidor.

### Pruebas

Para ejecutar las pruebas unitarias (si están disponibles):
```bash
npm test
```

## Consideraciones técnicas

### Persistencia de datos
La aplicación utiliza localStorage del navegador para simular una base de datos. Los datos persisten entre sesiones pero son específicos de cada navegador.

### Compatibilidad
La aplicación ha sido probada en navegadores modernos (Chrome, Firefox, Edge). Se recomienda usar las versiones más recientes.

### Descuentos
El sistema aplica automáticamente un 20% de descuento a usuarios con correos que terminen en @duoc.cl o @profesor.duoc.cl.

## Problemas conocidos

Si encuentras algún error al iniciar el proyecto, verifica que:
- Node.js esté correctamente instalado
- Las dependencias se hayan instalado completamente con `npm install`
- El puerto 3000 esté disponible

## Recursos adicionales

Para aprender más sobre las tecnologías utilizadas:
- [Documentación de React](https://reactjs.org/)
- [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Router](https://reactrouter.com/)
- [Bootstrap](https://getbootstrap.com/)
