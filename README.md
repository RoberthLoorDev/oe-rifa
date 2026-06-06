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
