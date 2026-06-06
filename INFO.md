# RifaApp — Product Requirements Document (PRD)
**Versión:** 1.0  
**Estado:** Borrador inicial  
**Audiencia:** Equipo de desarrollo  

---

## 1. Visión del producto

RifaApp es una plataforma móvil (y opcionalmente web) para gestionar rifas de forma profesional, transparente y sencilla. Está diseñada tanto para el organizador individual como para crecer como producto SaaS a nivel global, permitiendo que cualquier persona —sin importar su país o nivel técnico— pueda crear, administrar y compartir rifas de forma confiable.

**Propuesta de valor principal:** Llevar el caos del Excel y el WhatsApp a una herramienta clara, visual y compartible.

---

## 2. Plataforma recomendada

### Opción A — Expo (React Native) · Recomendada para MVP
- Una sola base de código para iOS y Android.
- Almacenamiento local con `expo-sqlite` (sin depender de ningún servidor en el MVP).
- Exportación de imagen con `react-native-view-shot`.
- Fácil migración futura a backend en la nube cuando se implemente el modelo SaaS.

### Opción B — Web + móvil con Capacitor (consideración futura)
- Desarrollar en Next.js y empaquetar para iOS/Android con Capacitor (similar a Cordova pero moderno).
- Viable, pero añade complejidad desde el inicio. No recomendado para el MVP.

### Base de datos
- **MVP:** Almacenamiento local con `expo-sqlite`. Rápido, sin costos, funciona sin internet.
- **Fase SaaS:** Migrar a **Neon** (PostgreSQL serverless, sin pausa automática) o **PlanetScale** como backend cloud. Supabase queda descartado por su política de pausa de proyectos inactivos.

### Modelo de negocio SaaS (post-MVP)
- **Plan gratuito:** Máximo N rifas activas simultáneas, datos locales.
- **Plan Pro:** Rifas ilimitadas, sincronización en la nube, acceso desde múltiples dispositivos, historial completo.
- **Open source:** El código puede ser público, con el modelo SaaS como servicio de valor añadido (almacenamiento, backups, multi-dispositivo).

---

## 3. Entidades del modelo de datos

```
Usuario
  └── Rifas (1:N)
        ├── Números (1:N)
        │     └── Asignación → Participante (N:1)
        ├── Participantes (registro del historial para sugerencias)
        └── Ganadores (1:N)

Rifa
  - id, título, descripción, precio_número
  - fecha_sorteo, imagen_producto
  - banco, número_cuenta, titular_cuenta
  - estado: EN_CURSO | COMPLETA | CERRADA | CANCELADA
  - total_números, creado_en

Número
  - id, rifa_id, numero
  - estado: DISPONIBLE | RESERVADO | PAGADO
  - participante_id (nullable), nota (texto corto, opcional)

Participante
  - id, nombre (normalizado para búsqueda), teléfono (opcional)
  - usado_en: lista de rifas (para historial y sugerencias)

Ganador
  - id, rifa_id, número_id, participante_id, fecha_sorteo
```

---

## 4. Módulos funcionales

### 4.1 Gestión de rifas

| Requisito | Descripción |
|-----------|-------------|
| Crear rifa | El usuario define: título, descripción opcional, precio por número, cantidad inicial de números, fecha del sorteo, imagen del producto (cámara o galería), y datos bancarios (banco + número de cuenta + titular). |
| Editar rifa | Modificar cualquier campo mientras la rifa esté EN_CURSO. |
| Ampliar números | Agregar más números al final del rango original sin afectar los ya asignados. |
| Estados de rifa | `EN_CURSO` → `COMPLETA` (automático cuando todos los números están PAGADOS o RESERVADOS) → `CERRADA` (tras el sorteo). También `CANCELADA` manualmente. |
| Lista de rifas | Vista en cards con: título, imagen, estado coloreado, fecha del sorteo y barra de progreso (números tomados / total). |
| Eliminar rifa | Solo posible si está CANCELADA o CERRADA. Requiere confirmación explícita. |

---

### 4.2 Dashboard de rifa

Pantalla principal de cada rifa. Muestra:

- Imagen del producto (destacada).
- Título y descripción.
- Fecha del sorteo (con cuenta regresiva si aplica).
- Cards de resumen:
  - Números totales / disponibles / reservados / pagados.
  - Monto recaudado (números pagados × precio) vs. monto esperado total.
  - Porcentaje de avance visual.
- Acceso rápido a: asignar número, exportar imagen, hacer sorteo.

---

### 4.3 Gestión de números y participantes

| Requisito | Descripción |
|-----------|-------------|
| Asignar número | El usuario selecciona un número disponible e ingresa el nombre del participante. El campo de nombre muestra sugerencias de participantes previos (autocompletado desde el historial local). Un participante puede tomar varios números. |
| Estados por número | `DISPONIBLE` → `RESERVADO` (tomado, sin pagar) → `PAGADO`. Cada estado tiene un color visual diferenciado. |
| Cambio de titular | Reasignar un número RESERVADO o PAGADO a otro participante. Se registra el cambio en el historial. |
| Nota por número | Campo de texto corto y opcional por número asignado. Ejemplo: "Pagó la mitad". |
| Cambio de estado de pago | El organizador puede mover un número de RESERVADO a PAGADO y viceversa desde la vista de detalle del número o desde la lista de participantes. |
| Vista de participantes | Lista de todos los participantes de la rifa, con sus números y estados de pago. Filtrable por estado. |
| Asignación múltiple rápida | Flujo optimizado para asignar varios números seguidos al mismo participante sin salir de la pantalla. |

---

### 4.4 Exportación de imagen

La imagen exportada es una plantilla visual prediseñada (no personalizable en el MVP) que incluye:

| Elemento | Obligatorio |
|----------|-------------|
| Imagen del producto | Sí |
| Título de la rifa | Sí |
| Descripción | Sí (si fue ingresada) |
| Frase inspiracional o nota del organizador | Opcional |
| Fecha del sorteo | Sí |
| Grilla de números con estados coloreados | Sí |
| Banco, titular y número de cuenta | Sí |

**Opciones al exportar:**
- Mostrar todos los números (disponibles marcados en verde, tomados en rojo/gris).
- Mostrar solo los números disponibles (ocultar los tomados).

**Tecnología:** `react-native-view-shot` para capturar el componente como imagen PNG y compartir vía `expo-sharing` (WhatsApp, etc.).

---

### 4.5 Sorteo

| Requisito | Descripción |
|-----------|-------------|
| Ejecutar sorteo | Solo disponible cuando hay al menos un número en estado PAGADO. Selecciona aleatoriamente entre los números PAGADOS únicamente. |
| Animación | Animación de "ruleta" o "mezcla de números" antes de revelar el ganador. Genera confianza visual aunque el resultado sea aleatorio y el código sea verificable. |
| Resultado | Muestra número ganador y nombre del participante. Guarda automáticamente en el historial de ganadores. |
| Transparencia | Al ser open source, cualquier persona puede auditar el algoritmo de sorteo. |

---

### 4.6 Historial y base de datos

- Historial de ganadores por rifa.
- Historial de participantes para sugerencias de autocompletado en futuras rifas.
- Las rifas CERRADAS y CANCELADAS quedan archivadas y consultables.
- Exportación de datos (CSV o PDF) — *backlog, no MVP*.

---

## 5. Requisitos no funcionales

| Área | Requisito |
|------|-----------|
| Rendimiento | La app debe funcionar completamente offline en el MVP. |
| Usabilidad | El flujo de crear una rifa y asignar los primeros 5 números no debe tomar más de 3 minutos para un usuario nuevo. |
| Internacionalización | Preparar la arquitectura para i18n desde el inicio (español e inglés como idiomas base). |
| Open Source | Código publicado en GitHub con licencia MIT o similar. El modelo SaaS es el diferenciador comercial. |
| Seguridad | En la fase SaaS, los datos de rifas son privados por usuario. No se comparten entre organizadores. |
| Accesibilidad | Contraste y tamaños de fuente accesibles. Etiquetas semánticas en todos los controles. |

---

## 6. Plantilla de imagen — especificación visual

La imagen exportada sigue este layout fijo (no editable en MVP):

```
┌──────────────────────────────────────────┐
│         [IMAGEN DEL PRODUCTO]            │
│                                          │
│  TÍTULO DE LA RIFA                       │
│  Descripción corta                       │
│  "Frase inspiracional opcional"          │
│  📅 Fecha del sorteo: DD/MM/YYYY         │
│                                          │
│  [ 01 ][ 02 ][ 03 ][ 04 ][ 05 ]...      │
│  [ 06 ][ 07 ][ 08 ][ 09 ][ 10 ]...      │
│  (colores según estado o solo disponib.) │
│                                          │
│  🏦 Banco: Nombre del banco              │
│  👤 Titular: Nombre titular              │
│  💳 Cuenta: XXXX-XXXX-XXXX              │
└──────────────────────────────────────────┘
```

Colores por estado en la grilla:
- **Verde:** DISPONIBLE
- **Amarillo/Naranja:** RESERVADO (tomado, sin pagar)
- **Rojo/Gris oscuro:** PAGADO (cerrado)

---

## 7. Roadmap por sprints (propuesta)

### Sprint 1 — Núcleo de datos y navegación (1 semana)
- Modelo de base de datos con `expo-sqlite`.
- Navegación principal (tabs: Mis Rifas / Historial).
- CRUD de rifas (crear, editar, ver, cancelar).
- Tests unitarios del modelo de datos.

### Sprint 2 — Gestión de números y participantes (1 semana)
- Vista de números de una rifa (grilla con colores por estado).
- Asignar número: búsqueda/autocompletado de participantes.
- Cambio de estado (Disponible → Reservado → Pagado).
- Cambio de titular y nota por número.

### Sprint 3 — Dashboard y UX (1 semana)
- Dashboard por rifa (cards de resumen, progreso, fecha).
- Lista de participantes con filtros.
- Pulido visual y microinteracciones.

### Sprint 4 — Exportación de imagen (1 semana)
- Componente de plantilla de imagen.
- Integración de `react-native-view-shot`.
- Opciones de exportación (mostrar/ocultar tomados).
- Compartir vía `expo-sharing`.

### Sprint 5 — Sorteo y cierre (1 semana)
- Algoritmo de sorteo sobre números PAGADOS.
- Animación del sorteo.
- Registro automático del ganador.
- Estado CERRADA en rifa.

### Sprint 6 — Pulido, i18n y publicación MVP (1 semana)
- Internacionalización (ES/EN).
- Onboarding para usuarios nuevos.
- Publicación en Google Play y App Store (TestFlight).

### Backlog (post-MVP)
- Modelo SaaS: backend con Neon + autenticación.
- Sincronización en la nube.
- Plan Pro y gestión de suscripciones.
- Exportación CSV/PDF de participantes.
- Temas visuales para la plantilla de imagen.
- Widget de rifa para compartir como link web (modo lectura).

---

## 8. Criterios de aceptación globales

- Un usuario puede crear una rifa completa y exportar una imagen en menos de 5 minutos.
- La grilla de números es legible y operable con pulgar en pantallas de 5.5" en adelante.
- El sorteo selecciona únicamente entre números PAGADOS y registra el resultado de forma persistente.
- La app funciona completamente sin conexión a internet en el MVP.
- Los datos no se pierden al cerrar y reabrir la app.

---

*Documento generado como punto de partida para el equipo de desarrollo. Sujeto a revisión en la primera sesión de refinamiento de backlog.*
