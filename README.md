# ENTREGA EVA3 — Front Level Up (Servicio Frontend)

## 1) Descripción
Esta entrega corresponde a la **EVA3** del proyecto **Front_level_up**, un **servicio Frontend** para la tienda **Level Up**, desarrollado con tecnologías web (HTML, CSS y JavaScript). El objetivo de esta etapa es presentar una versión funcional y presentable del frontend, con estructura clara, estilos consistentes y comportamiento dinámico en el navegador.

Repositorio: `ClaudioFranciscoDelgadoGallardo/Front_level_up`

## 2) Alcance de la entrega (EVA3)
En esta entrega se incluye:

- **Interfaz web** con estructura basada en HTML.
- **Estilos** aplicados mediante CSS para una presentación coherente.
- **Interactividad y lógica de cliente** mediante JavaScript (manejo del DOM, validaciones básicas, acciones de UI).
- **Organización del proyecto** en carpetas/archivos para facilitar mantención y lectura.
- **Evidencia de funcionamiento**: la aplicación debe poder ejecutarse localmente en un navegador.

> Nota: Esta entrega se centra en el **frontend**. Si existe integración con backend o base de datos, se considera solo en la medida en que el frontend lo consuma o lo simule.

## 3) Tecnologías utilizadas
- **HTML**: estructura de vistas y componentes.
- **CSS**: estilos, layout, responsividad (si aplica).
- **JavaScript**: interacción, eventos, renderizado dinámico, lógica en el cliente.

Lenguajes detectados en el repositorio (referencial):
- JavaScript (51.9%)
- Java (17.3%)
- HTML (11%)
- PLpgSQL (9.8%)
- CSS (9%)
- Shell (0.8%)

## 4) Requisitos para ejecutar
- Navegador web actualizado (Chrome, Edge o Firefox).
- (Opcional) Servidor local simple para evitar problemas de CORS si hay cargas de archivos JSON o módulos:
  - VS Code Live Server, o
  - `python -m http.server`, etc.

## 5) Instalación y ejecución local
### Opción A: Abrir directamente
1. Descargar o clonar el repositorio.
2. Ubicar el archivo principal (por ejemplo `index.html`).
3. Abrirlo con doble clic en el navegador.

### Opción B: Ejecutar con servidor local (recomendado)
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ClaudioFranciscoDelgadoGallardo/Front_level_up.git
   ```
2. Entrar al proyecto:
   ```bash
   cd Front_level_up
   ```
3. Levantar un servidor local (ejemplo con Python):
   ```bash
   python -m http.server 5500
   ```
4. Abrir en el navegador:
   - `http://localhost:5500`

## 6) Estructura del proyecto (referencial)
La estructura real puede variar, pero típicamente se organiza como:

- `index.html`: página principal o punto de entrada.
- `assets/`: recursos estáticos (imágenes, íconos, fuentes).
- `css/`: hojas de estilo (por ejemplo `styles.css`).
- `js/`: scripts (por ejemplo `main.js`, `validations.js`).
- `pages/` (si existe): vistas adicionales (catálogo, detalle, carrito, contacto, etc.).

## 7) Funcionalidades consideradas en EVA3 (según frontend típico de tienda)
Dependiendo de lo implementado en tu repositorio, esta entrega puede contemplar:

- Navegación entre secciones (inicio, catálogo, contacto, etc.).
- Listado de productos (estático o dinámico).
- Vista de detalle de producto (si aplica).
- Carrito (agregar, quitar, modificar cantidades) en memoria/localStorage (si aplica).
- Validación de formularios (contacto/registro/login) del lado del cliente (si aplica).
- Componentes reutilizables (navbar, footer, tarjetas de producto).

## 8) Criterios de evaluación (EVA3)
Para esta entrega se considera:

- **Correcta ejecución local** y estabilidad del frontend.
- **Código legible y organizado** (nombres coherentes, separación HTML/CSS/JS).
- **Consistencia visual** (tipografías, colores, espaciados, alineación).
- **Interactividad real** (eventos, cambios de estado, manipulación DOM).
- **Buenas prácticas mínimas**: evitar duplicación innecesaria, uso correcto de rutas y recursos.

## 9) Instrucciones de entrega (lo que se espera que el evaluador haga)
1. Descargar/clonar el repositorio.
2. Ejecutar localmente (idealmente con servidor local).
3. Navegar por las vistas/funcionalidades disponibles.
4. Revisar estructura y claridad del código.

## 10) Autor
- Usuario GitHub: **ClaudioFranciscoDelgadoGallardo**

---
**ENTREGA EVA3** — Proyecto Front Level Up
