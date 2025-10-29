# 🚀 Importación de Proyecto Level-UP a REACT a Jira

Guía completa para importar las 47 tareas del proyecto a Jira usando el archivo JSON.

---

## 📋 Archivos Disponibles

### 1. `proyecto-jira-completo.json` ⭐ (RECOMENDADO)
**Estructura completa del proyecto** lista para importar:
- 7 Epics organizados por semana (15 sept - 2 nov 2025)
- 47 tareas con todas sus propiedades
- Asignaciones a desarrolladores
- Story points, componentes y labels

### 2. `tareas-jira.csv` (Alternativa)
**Archivo CSV** para importación manual:
- Compatible con el importador nativo de Jira
- Requiere crear epics manualmente después

---

## 🎯 MÉTODO RECOMENDADO: Importar JSON en Jira

⏱️ **Tiempo estimado:** 3-5 minutos  
🔧 **Requisitos:** Permisos de administrador del proyecto

---

## � PASO A PASO: Importación de JSON

## 📥 PASO A PASO: Importación de JSON

### Preparación Previa (5 minutos)

#### 1️⃣ Crear Componentes del Proyecto

Antes de importar, debes crear los 12 componentes en tu proyecto Jira:

1. Ve a **Configuración del proyecto** (⚙️ en la barra lateral izquierda)
2. Haz clic en **Componentes** en el menú lateral
3. Haz clic en **Crear componente** y crea cada uno de estos:

| # | Nombre | Descripción |
|---|--------|-------------|
| 1 | Seguridad | Autenticación, autorización y rutas protegidas |
| 2 | Autenticación | Login, registro y gestión de sesiones |
| 3 | Panel Admin | Dashboard administrativo y CRUD completo |
| 4 | Productos | Catálogo, detalle y gestión de productos |
| 5 | Carrito | Shopping cart y checkout |
| 6 | Testing | Tests unitarios y configuración |
| 7 | Utilidades | Funciones helper y utilidades compartidas |
| 8 | Componentes | Componentes React reutilizables |
| 9 | Páginas Públicas | Páginas informativas (Nosotros, Contacto, Noticias) |
| 10 | Estilos | CSS y diseño visual |
| 11 | Configuración | Build tools y configuración del proyecto |
| 12 | Desarrollo | Herramientas de desarrollo y debugging |

---

### Importación del Archivo JSON

#### 2️⃣ Instalar la App "JSON Importer for Jira"

Jira no tiene un importador JSON nativo, pero hay apps gratuitas en el Marketplace:

**OPCIÓN A: Jira Cloud (Atlassian Cloud)**

1. Ve a **Aplicaciones** → **Buscar nuevas aplicaciones** en tu Jira
2. Busca: **"JSON Importer for Jira"** o **"Jira Importers"**
3. Instala una de estas apps (tienen versión gratuita):
   - **JSON Importer for Jira** (por StiltSoft)
   - **Elements Importer** (por Elements Apps)
4. Sigue las instrucciones de la app para importar `proyecto-jira-completo.json`

**OPCIÓN B: Usar la REST API de Jira (Más técnico)**

Si prefieres no instalar apps, puedes usar herramientas como **Postman** o **cURL** para importar vía REST API. Ver sección avanzada al final.

---

### � ALTERNATIVA MÁS SIMPLE: Importar CSV

Si la opción JSON te parece complicada, **usa el CSV** que es más directo:

#### 3️⃣ Importar el archivo CSV

1. Ve a tu proyecto en Jira
2. Haz clic en **"⋮"** (tres puntos en la esquina superior derecha) → **"Importar"**
3. Selecciona **"CSV"**
4. Haz clic en **"Seleccionar un archivo CSV"** y elige `tareas-jira.csv`
5. **IMPORTANTE - Mapeo de columnas (3 columnas):**
   
   En la pantalla verás 3 columnas: **CSV Field**, **JIRA Fields** y **MAP field value**
   
   Configura así:

   | CSV Field (columna 1) | JIRA Fields (columna 2 - selecciona del desplegable) | MAP field value (columna 3 - checkbox) |
   |----------------------|------------------------------------------------------|----------------------------------------|
   | **Summary** | Selecciona: **Summary** o **Resumen** | ✅ Marca el checkbox |
   | **Issue Type** | Selecciona: **Issue Type** o **Tipo de incidencia** | ✅ Marca el checkbox |
   | **Priority** | Si NO aparece: selecciona **"Do not map"** o **"No mapear"** | ⬜ NO marcar |
   | **Description** | Selecciona: **Description** o **Descripción** | ⬜ NO marcar |
   | **Labels** | Selecciona: **Labels** o **Etiquetas** | ⬜ NO marcar |
   | **Component** | Si NO aparece: selecciona **"Do not map"** o **"No mapear"** | ⬜ NO marcar |
   | **Assignee** | Selecciona: **Assignee** o **Encargado** o **Asignado** | ✅ Marca el checkbox |
   | **Story Points** | Si NO aparece: selecciona **"Do not map"** o **"No mapear"** | ⬜ NO marcar |

   **📌 CAMPOS QUE SÍ DEBES MAPEAR (obligatorios):**
   - ✅ **Summary** → Summary/Resumen + marca checkbox
   - ✅ **Issue Type** → Issue Type/Tipo de incidencia + marca checkbox
   - ✅ **Description** → Description/Descripción (sin checkbox)
   - ✅ **Labels** → Labels/Etiquetas (sin checkbox)
   - ⚠️ **Assignee** → **"Do not map"** (No mapear) - Evita errores de usuarios no encontrados
   
   **⚠️ CAMPOS QUE PUEDES DEJAR SIN MAPEAR:**
   - ⬜ **Priority** → "Do not map" (lo agregarás después manualmente)
   - ⬜ **Component** → "Do not map" (lo agregarás después manualmente)
   - ⬜ **Assignee** → "Do not map" (lo asignarás después manualmente)
   - ⬜ **Story Points** → "Do not map" (lo agregarás después manualmente)

6. Haz clic en **"Comenzar importación"** o **"Begin Import"** o **"Siguiente"**
7. Si te pide mapear valores específicos (siguiente pantalla), configura:
   - **Issue Type:** Task → Tarea (o el nombre que uses en tu proyecto)

8. Espera a que se completen las 47 tareas ✅

**💡 Nota importante:** 
- Las tareas se importarán **sin asignar** (esto evita errores de usuarios)
- Después podrás asignarlas manualmente usando los **Labels** para filtrar por sprint
- Component, Priority y Story Points también los agregarás después

---

### 📝 DESPUÉS DE LA IMPORTACIÓN: Asignar tareas por Labels

Una vez importadas las 47 tareas, asígnalas usando los labels:

#### Asignar a Rodrigo Yarzu (16 tareas - Auth, Carrito):
Busca con JQL:
```
labels in (autenticacion, carrito, validacion) AND assignee = EMPTY
```
Selecciona todas → **Edición masiva** → Asignar a **Rodrigo** (o tu usuario)

#### Asignar a Claudio Francisco Delgado Gallardo (13 tareas - Admin, CRUD):
Busca con JQL:
```
labels in (admin, crud, logs) AND assignee = EMPTY
```
Selecciona todas → **Edición masiva** → Asignar a **Claudio** (o tu usuario)

#### Asignar a Giovanni Antonio Orellana Muñoz (18 tareas - UI, Testing):
Busca con JQL:
```
labels in (testing, ui, paginas, css) AND assignee = EMPTY
```
Selecciona todas → **Edición masiva** → Asignar a **Giovanni** (o tu usuario)

---

### 🔧 OPCIONAL: Habilitar campos faltantes ANTES de importar

Si quieres que Component, Priority y Story Points funcionen, sigue estos pasos:

#### Habilitar Priority (Prioridad):
1. Ve a **Configuración del proyecto** (⚙️)
2. Ve a **Tipos de incidencia** → **Tarea**
3. Busca el campo **"Prioridad"** o **"Priority"**
4. Asegúrate de que esté habilitado (arrástralo a la pantalla si no está)
5. Guarda los cambios

#### Habilitar Components (Componentes):
1. Ve a **Configuración del proyecto** (⚙️)
2. Haz clic en **Componentes** en el menú lateral
3. Si la opción no existe, es porque tu tipo de proyecto no soporta componentes
4. En ese caso, déjalo sin mapear y usa **Labels** en su lugar

#### Habilitar Story Points:
1. Ve a **Configuración del proyecto** (⚙️)
2. Ve a **Tipos de incidencia** → **Tarea**
3. Busca **"Story Points"** o **"Puntos de historia"**
4. Si no existe, puedes crear un campo personalizado o dejarlo sin mapear

**Después de habilitar estos campos, vuelve a intentar la importación del CSV.**

---

#### 4️⃣ Crear los 7 Epics Manualmente (Solo si usaste CSV)

Después de importar el CSV, crea estos 7 Epics:

1. Haz clic en **"Crear"** (botón azul superior)
2. Selecciona **Tipo de incidencia: Épica**
3. Crea cada epic con estos datos:

**Epic 1: Sprint 1 - Configuración y Setup**
- **Resumen:** Sprint 1: Configuración y Setup del Proyecto
- **Descripción:** Configuración inicial del proyecto React, instalación de dependencias, estructura de carpetas y setup de herramientas de desarrollo
- **Fecha de inicio:** 15/09/2025
- **Fecha de vencimiento:** 21/09/2025
- **Etiquetas:** sprint-1, setup, configuracion

**Epic 2: Sprint 2 - Autenticación y Seguridad**
- **Resumen:** Sprint 2: Autenticación y Seguridad
- **Descripción:** Implementación completa del sistema de autenticación con roles, login, registro y protección de rutas administrativas
- **Fecha de inicio:** 22/09/2025
- **Fecha de vencimiento:** 28/09/2025
- **Etiquetas:** sprint-2, autenticacion, seguridad

**Epic 3: Sprint 3 - Catálogo de Productos y Carrito**
- **Resumen:** Sprint 3: Catálogo de Productos y Carrito
- **Descripción:** Desarrollo del catálogo de productos con filtros, página de detalle, carrito de compras y Context API para estado global
- **Fecha de inicio:** 29/09/2025
- **Fecha de vencimiento:** 05/10/2025
- **Etiquetas:** sprint-3, productos, carrito

**Epic 4: Sprint 4 - Panel de Administración - CRUD**
- **Resumen:** Sprint 4: Panel de Administración - CRUD
- **Descripción:** Panel administrativo completo con dashboard, CRUD de productos, CRUD de usuarios y gestión de destacados
- **Fecha de inicio:** 06/10/2025
- **Fecha de vencimiento:** 12/10/2025
- **Etiquetas:** sprint-4, admin, crud

**Epic 5: Sprint 5 - Auditoría y Componentes UI**
- **Resumen:** Sprint 5: Auditoría y Componentes UI
- **Descripción:** Sistema de logs/auditoría, componentes reutilizables (modales, notificaciones) y páginas informativas
- **Fecha de inicio:** 13/10/2025
- **Fecha de vencimiento:** 19/10/2025
- **Etiquetas:** sprint-5, logs, ui-components

**Epic 6: Sprint 6 - Testing y Estilos**
- **Resumen:** Sprint 6: Testing y Estilos
- **Descripción:** Configuración de testing con Karma/Jasmine, tests unitarios y estilos CSS para todas las páginas
- **Fecha de inicio:** 20/10/2025
- **Fecha de vencimiento:** 26/10/2025
- **Etiquetas:** sprint-6, testing, estilos

**Epic 7: Sprint 7 - Refinamiento y Entrega Final**
- **Resumen:** Sprint 7: Refinamiento y Entrega Final
- **Descripción:** Pulido final, debugging, páginas secundarias y preparación para entrega EVA2
- **Fecha de inicio:** 27/10/2025
- **Fecha de vencimiento:** 02/11/2025
- **Etiquetas:** sprint-7, polish, entrega

---

#### 5️⃣ Vincular Tareas con Epics (Solo si usaste CSV)

Después de crear los epics, vincula las tareas usando las **etiquetas**:

1. Ve a **Tablero** o **Backlog**
2. Usa el filtro **Etiquetas** para filtrar por sprint:
   - Filtra por `sprint-1` → Selecciona todas → Asigna a Epic "Sprint 1"
   - Filtra por `sprint-2` → Selecciona todas → Asigna a Epic "Sprint 2"
   - ... y así sucesivamente para los 7 sprints

**O más rápido con búsqueda JQL:**

```
labels = sprint-1
```

Selecciona todas las tareas del resultado → **Edición masiva** → **Cambiar Epic** → Selecciona "Sprint 1"

Repite para `sprint-2`, `sprint-3`, etc.

---

## 🎯 Verificación Post-Importación

Después de importar, verifica que todo esté correcto:

### Checklist de Verificación

- [ ] **7 Epics creados** con fechas correctas (Sept 15 - Nov 2)
- [ ] **47 Tareas importadas** y distribuidas entre los epics
- [ ] **Asignaciones correctas:**
  - Rodrigo Yarzu: 16 tareas (73 story points)
  - Claudio Francisco Delgado Gallardo: 13 tareas (66 story points)
  - Giovanni Antonio Orellana Muñoz: 18 tareas (78 story points)
- [ ] **Story points configurados** (total: 217 puntos)
- [ ] **12 Componentes creados** y asignados
- [ ] **Labels asignados** (sprint-1 a sprint-7 + categorías)
- [ ] **Prioridades correctas** (15 High, 25 Medium, 7 Low)

### Vista Rápida en Board

1. Ve a tu **Tablero** (vista Kanban o Scrum)
2. Agrupa por **Epic** para ver las 7 sprints
3. Verifica que cada epic tenga sus tareas asignadas
4. Revisa que los story points sumen **217 pts** en total

---

## 📊 Distribución del Proyecto

### Resumen de Epics

| Sprint | Fechas | Tareas | Story Points | Enfoque Principal |
|--------|--------|--------|--------------|-------------------|
| Sprint 1 | Sept 15-21 | 4 | 15 | Configuración inicial y setup |
| Sprint 2 | Sept 22-28 | 7 | 29 | Autenticación y seguridad |
| Sprint 3 | Sept 29 - Oct 5 | 10 | 39 | Productos y carrito de compras |
| Sprint 4 | Oct 6-12 | 9 | 42 | Panel administrativo completo |
| Sprint 5 | Oct 13-19 | 9 | 23 | Auditoría y componentes UI |
| Sprint 6 | Oct 20-26 | 8 | 34 | Testing y estilos CSS |
| Sprint 7 | Oct 27 - Nov 2 | 1 | 2 | Refinamiento y entrega |
| **TOTAL** | **7 semanas** | **47** | **217** | **Proyecto completo** |

### Distribución por Desarrollador

| Desarrollador | Tareas | Story Points | Enfoque |
|---------------|--------|--------------|---------|
| Rodrigo Yarzu | 16 | 73 | Auth, Carrito, Estado Global |
| Claudio Francisco Delgado Gallardo | 13 | 66 | Panel Admin, CRUD, Logs |
| Giovanni Antonio Orellana Muñoz | 18 | 78 | UI/UX, Testing, Páginas |

---

## 🆘 Solución de Problemas

### ❌ "Component does not exist"
**Solución:** Vuelve al Paso 1️⃣ y crea todos los componentes manualmente antes de importar.

### ❌ "User cannot be assigned issues"
**Solución:** 
1. Verifica que los usuarios existan en tu Jira
2. Asegúrate de que tengan acceso al proyecto (Configuración del proyecto → Personas)
3. Si los nombres no coinciden, edita el CSV manualmente antes de importar

### ❌ "Story Points field not found"
**Solución:**
1. Ve a **Configuración del proyecto** → **Tipos de incidencia** → **Tarea**
2. Agrega el campo **Story Points** (Puntos de historia) si no existe
3. Si usas un campo personalizado, mapéalo durante la importación

### ❌ "No puedo instalar apps en Jira"
**Solución:** Usa el método CSV (Paso 3️⃣) que es nativo de Jira y no requiere apps adicionales.

### ❌ "La importación falla con errores"
**Solución:**
1. Asegúrate de tener permisos de administrador del proyecto
2. Verifica que el proyecto exista y esté activo
3. Revisa que el tipo de proyecto sea compatible (Scrum o Kanban)
4. Contacta a tu administrador de Jira si no tienes permisos

---

## � Método Avanzado: REST API con Postman

Si eres técnico y prefieres usar la API directamente:

### Configuración en Postman

1. **Crear Collection** con autenticación Basic Auth:
   - Username: tu@email.com
   - Password: TU_API_TOKEN (de https://id.atlassian.com/manage-profile/security/api-tokens)

2. **Importar el JSON** modificando cada issue del archivo:

```http
POST https://tu-dominio.atlassian.net/rest/api/3/issue
Content-Type: application/json

{
  "fields": {
    "project": {"key": "LVL"},
    "summary": "Nombre de la tarea",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Descripción"}]}]
    },
    "issuetype": {"name": "Task"},
    "priority": {"name": "High"}
  }
}
```

3. Repetir para cada epic y tarea del JSON

⚠️ **Nota:** Este método es más complejo y requiere conocimientos de REST APIs.

---

## 📞 Recursos Adicionales

- **Documentación Oficial de Jira:**
  - [CSV Import Guide](https://support.atlassian.com/jira-cloud-administration/docs/import-data-from-a-csv-file/)
  - [REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
  
- **Apps del Marketplace:**
  - [JSON Importer for Jira](https://marketplace.atlassian.com/search?query=json%20importer)
  - [Elements Importer](https://marketplace.atlassian.com/apps/1211520/elements-importer)

---

## ✅ Checklist Final

- [ ] He creado los 12 componentes en el proyecto
- [ ] He elegido el método de importación (CSV recomendado)
- [ ] He importado las 47 tareas desde el CSV
- [ ] He creado los 7 Epics manualmente
- [ ] He vinculado las tareas con sus epics usando labels
- [ ] He verificado las asignaciones de usuarios
- [ ] He confirmado que los story points están configurados (217 total)
- [ ] He revisado que todas las prioridades sean correctas
- [ ] He configurado las fechas de los epics/sprints
- [ ] El proyecto está listo para trabajar 🎉

---

**Proyecto:** Level-UP a REACT  
**Team:** Rodrigo Yarzu, Claudio Francisco Delgado Gallardo, Giovanni Antonio Orellana Muñoz  
**Timeline:** 15 Septiembre - 2 Noviembre 2025  
**Total Tasks:** 47 tareas + 7 epics = 54 issues  
**Total Story Points:** 217 pts
