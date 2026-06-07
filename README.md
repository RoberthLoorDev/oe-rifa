# RifaApp — Guía de Desarrollo y Configuración

RifaApp es una plataforma móvil y web *offline-first* diseñada para organizar, gestionar y compartir rifas profesionales de forma transparente y visual. Esta guía documenta la estructura, las herramientas y la normalización de estilos utilizadas en el proyecto.

---

## 🛠️ Herramientas y Stack Tecnológico

1. **Núcleo:** [Expo (React Native)](https://expo.dev) con soporte de TypeScript.
2. **Estilos:** [Tailwind CSS (NativeWind v4)](https://www.nativewind.dev/) para un estilado multiplataforma coherente.
3. **Persistencia (Offline-first):** `expo-sqlite` para una base de datos local SQLite incrustada en el dispositivo (sin dependencias de red en el MVP).
4. **Iconos:** `@expo/vector-icons` (Ionicons) empaquetados localmente, garantizando un funcionamiento 100% sin conexión a internet tanto en web como en dispositivos móviles.

---

## 📂 Estructura y Organización del Proyecto

El proyecto utiliza **Expo Router** con una arquitectura de navegación mixta (**Stack-over-Tabs**). El directorio principal del código fuente es `src/`:

```text
rifa-app/
├── assets/                 # Recursos gráficos y fuentes locales
├── src/
│   ├── app/                # Enrutamiento basado en archivos (Expo Router)
│   │   ├── (tabs)/         # Páginas con barra de pestañas (Tab Bar)
│   │   │   ├── _layout.tsx # Layout del Tab bar (Carga AppTabs)
│   │   │   ├── index.tsx   # Dashboard principal (Mis Rifas)
│   │   │   └── history.tsx # Historial de rifas finalizadas
│   │   ├── raffle/         # Pantallas de rifas (Fuera de pestañas/Stack)
│   │   │   ├── [id]/
│   │   │   │   ├── index.tsx        # Dashboard individual de una rifa
│   │   │   │   ├── numbers.tsx      # Grilla de números
│   │   │   │   ├── participants.tsx # Lista de participantes
│   │   │   │   ├── draw.tsx         # Pantalla para realizar el sorteo
│   │   │   │   └── edit.tsx         # Pantalla de edición de rifa
│   │   │   └── create.tsx  # Pantalla de creación de Nueva Rifa
│   │   └── _layout.tsx     # Stack de navegación raíz (gestiona transiciones)
│   ├── components/         # Componentes organizados por dominio
│   │   ├── home/           # Buscador, filtros y lista de rifas
│   │   ├── raffle/         # Grilla de números y modales de boletos
│   │   ├── raffle-detail/  # Progreso, estadísticas y actividad reciente
│   │   └── participants/   # Filtros, buscador y tarjetas de participantes con WhatsApp
│   ├── constants/
│   │   └── theme.ts        # Valores del sistema de diseño (Colores JS, espaciados)
│   ├── hooks/              # React hooks personalizados
│   └── global.css          # Archivo global de Tailwind y variables CSS
├── app.json                # Configuración global de Expo (Bloqueado a Light Mode)
├── tailwind.config.js      # Configuración de escaneo y temas de Tailwind
└── tsconfig.json           # Configuración de TypeScript
```

---

## 🎨 Sistema de Diseño y Normalización (Estilos)

Para mantener la app consistente en todas las plataformas y facilitar el mantenimiento, la interfaz está configurada en **modo Light por defecto** y usa la siguiente plantilla de estilos:

### 1. Paleta de Colores
Definida en `tailwind.config.js` y mapeada en `src/constants/theme.ts`:
- **Fondo General (`bg-app-bg`):** `#F5F5F7`
- **Acento Primario (`bg-app-accent`):** `#3B6FFF`
- **Foco/Hover de Acento (`bg-app-accentHover`):** `#2A52BE`
- **Disponible / Éxito (`text-app-green`):** `#22C55E`
- **Reservado / Alerta (`text-app-orange`):** `#F59E0B`
- **Pagado / Peligro (`text-app-red`):** `#EF4444`
- **Gris / Muted (`text-app-gray`):** `#9CA3AF`
- **Oscuro / Texto (`text-app-dark`):** `#111827`
- **Fondo de Tarjetas (`bg-white`):** `#FFFFFF`

### 2. Sombras
- **`shadow-card`:** `0 4px 20px -2px rgba(0, 0, 0, 0.05)` (para tarjetas del Home, inputs y cabeceras).
- **`shadow-sheet`:** `0 -10px 40px -10px rgba(0, 0, 0, 0.15)` (para botones inferiores fijos).

### 3. Tipografía y Escala de Fuentes (Norma Global)
La fuente predeterminada es **Plus Jakarta Sans** (con fallback a sans-serif en móvil). Para asegurar una legibilidad óptima y adaptabilidad al pulgar en celulares de 5.5" en adelante, se establecen las siguientes reglas de escala tipográfica y dimensiones para todas las pantallas del proyecto:

* **Tallas de texto principales:**
  - **Título de Portada (Hero/Banner):** `text-3xl` (30px) — Grande, audaz y con suficiente contraste.
  - **Título de Pantalla (Header estándar):** `text-xl` (20px) — Despejado y visible en la cabecera.
  - **Títulos de Tarjetas y Secciones:** `text-base` (16px) — Delimita visualmente las áreas de información.
  - **Texto de Botón Principal / CTA:** `text-lg` (18px) — Destacado, centrado y fácil de clickear.
  - **Valores de Inputs y Textos de Lectura:** `text-base` (16px) — Tamaño cómodo para lectura en pantallas pequeñas.
  - **Etiquetas de Inputs (Labels) e Información secundaria:** `text-sm` (14px) — Guías rápidas y descriptivas.
  - **Metadatos y Textos Terciarios (ej. tiempos log):** `text-xs` (12px) — Nivel mínimo de tipografía (evitar `text-[10px]` para accesibilidad).

* **Dimensiones de Banner Destacado:**
  - **Altura de Imagen:** El banner principal del Dashboard de Rifa debe tener una altura fija de `h-80` (320px) en lugar de 256px (`h-64`). Esto asegura que haya suficiente espacio visible para la imagen de fondo por debajo del menú flotante translúcido y la barra de estado superior.

### 4. Nuevos Campos Normalizados
- **Producto / Premio (`product`):** Campo de texto integrado en los formularios de creación, edición e informes. Se muestra dinámicamente debajo del título del sorteo en el banner principal y en los encabezados secundarios con el icono de regalo (`gift-outline` de Ionicons) y un diseño translúcido para garantizar una jerarquía limpia y profesional.

---

## 💻 Desarrollo en Entorno Web

Al ejecutar y probar el proyecto en web mediante `npm run web`, se aplican consideraciones especiales para mantener el comportamiento móvil:

### 1. Barra de Pestañas Adaptada
El archivo `src/components/app-tabs.web.tsx` fuerza una barra de pestañas fija en la parte inferior de la pantalla (`bottom: 0`), imitando al 100% la sensación de estar usando la app en un teléfono móvil en lugar de mostrar un menú de navegación de escritorio clásico.

### 2. Anulación de Contornos Web (Outline Suppression)
Los navegadores web suelen aplicar un contorno negro o azul grueso por defecto a los inputs de texto al hacer foco. Para evitar que esto opaque nuestros estilos de Tailwind, a cada `TextInput` se le pasa un estilo en línea condicional para web:
```tsx
const inputStyle = Platform.OS === 'web' ? { outlineStyle: 'none' as any } : undefined;

<TextInput style={inputStyle} className="bg-app-bg border border-transparent focus:border-app-accent focus:bg-white ..." />
```
Esto desactiva el contorno del navegador y activa suavemente el borde azul de la marca (`#3B6FFF`) configurado con clases de Tailwind.

---

## 💾 Estructura de la Base de Datos Local (SQL / SQLite)

Para dar soporte al enfoque *offline-first* del proyecto, el motor de base de datos local utiliza `expo-sqlite`. A continuación se define el esquema relacional DDL oficial para gestionar las rifas, los boletos adquiridos y el historial de actividad reciente:

### 1. Esquema DDL (Tablas e Índices)

```sql
-- Activar integridad referencial de llaves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- Tabla de Rifas
CREATE TABLE IF NOT EXISTS raffles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    product TEXT, -- Campo opcional para Producto / Premio
    ticket_count INTEGER NOT NULL CHECK (ticket_count IN (30, 50, 100, 1000)),
    ticket_price REAL NOT NULL CHECK (ticket_price >= 0),
    draw_date TEXT NOT NULL, -- Formato ISO8601 o YYYY-MM-DD
    status TEXT NOT NULL CHECK (status IN ('EN_CURSO', 'COMPLETA', 'CERRADA')) DEFAULT 'EN_CURSO',
    winner_ticket_num INTEGER, -- Almacena el número ganador tras el sorteo
    winner_name TEXT, -- Almacena el nombre del ganador para consulta rápida
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Tabla de Boletos / Participantes
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raffle_id INTEGER NOT NULL,
    ticket_num INTEGER NOT NULL CHECK (ticket_num >= 1),
    participant_name TEXT NOT NULL,
    participant_phone TEXT,
    status TEXT NOT NULL CHECK (status IN ('RESERVADO', 'PAGADO')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (raffle_id) REFERENCES raffles (id) ON DELETE CASCADE,
    UNIQUE (raffle_id, ticket_num) -- Evita duplicidad de boletos en el mismo sorteo
);

-- Tabla de Registro de Actividad Reciente
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raffle_id INTEGER NOT NULL,
    description TEXT NOT NULL, -- Ejemplo: 'Juan Pérez pagó el boleto 03'
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (raffle_id) REFERENCES raffles (id) ON DELETE CASCADE
);

-- Índices optimizados para mejorar búsquedas y velocidad de renderizado
CREATE INDEX IF NOT EXISTS idx_tickets_raffle ON tickets (raffle_id);
CREATE INDEX IF NOT EXISTS idx_logs_raffle ON activity_logs (raffle_id);
```

### 2. Consultas Analíticas Clave (Dashboard)

Para alimentar las tarjetas de progreso y estadísticas en el Dashboard de una Rifa (`src/app/raffle/[id]/index.tsx`), se recomienda ejecutar la siguiente consulta optimizada que calcula métricas agregadas en un solo paso:

```sql
SELECT 
    r.id,
    r.title,
    r.product,
    r.ticket_count,
    r.ticket_price,
    -- Total de boletos pagados
    COUNT(CASE WHEN t.status = 'PAGADO' THEN 1 END) AS count_paid,
    -- Total de boletos reservados
    COUNT(CASE WHEN t.status = 'RESERVADO' THEN 1 END) AS count_reserved,
    -- Total de boletos disponibles
    (r.ticket_count - COUNT(t.id)) AS count_available,
    -- Dinero total cobrado (recaudación actual)
    COUNT(CASE WHEN t.status = 'PAGADO' THEN 1 END) * r.ticket_price AS money_collected,
    -- Dinero pendiente por cobrar
    COUNT(CASE WHEN t.status = 'RESERVADO' THEN 1 END) * r.ticket_price AS money_pending,
    -- Recaudación esperada al completar la rifa
    r.ticket_count * r.ticket_price AS money_expected
FROM raffles r
LEFT JOIN tickets t ON r.id = t.raffle_id
WHERE r.id = ?
GROUP BY r.id;
```
