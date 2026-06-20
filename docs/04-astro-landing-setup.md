# Astro Landing Page Setup

## Requisitos

- Monorepo ya migrado a pnpm con `apps/mobile/` funcionando
- Node.js 20+

## Paso 1: Crear proyecto Astro

```bash
# Desde la raíz del monorepo
pnpm create astro@latest apps/landing -- --template basics --no-install --skip-git --no-typescript
```

Flags:
- `--template basics` → template mínimo
- `--no-install` → no instalar deps (lo hará pnpm desde la raíz)
- `--skip-git` → no inicializar git (ya estamos en un repo)
- `--no-typescript` → lo configuramos manual después

## Paso 2: Configurar workspaces

Agregar `name` al `apps/landing/package.json`:

```diff
{
+ "name": "@rifa-app/landing",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

## Paso 3: Instalar dependencias

```bash
pnpm install
```

Esto detecta el nuevo workspace e instala las deps de Astro.

## Paso 4: Agregar Tailwind a Astro

```bash
pnpm --filter landing add @astrojs/tailwind tailwindcss
```

Actualizar `astro.config.mjs`:

```diff
import { defineConfig } from 'astro/config';
+ import tailwind from '@astrojs/tailwind';

export default defineConfig({
+  integrations: [tailwind()],
});
```

## Paso 5: Migrar landing.html a Astro

### Estructura de páginas

```
apps/landing/src/pages/
├── index.astro          # landing page principal
├── features.astro       # (opcional) features detalladas
├── privacy.astro        # (opcional) política de privacidad
└── terms.astro          # (opcional) términos y condiciones
```

El contenido actual de `landing.html` se migra a `index.astro` usando:

- **Layout:** `src/layouts/Layout.astro` (meta tags, header, footer)
- **Componentes:** `src/components/` (Hero.astro, Features.astro, FAQ.astro, etc.)

### Layout base (src/layouts/Layout.astro)

```astro
---
export interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>{title}</title>
</head>
<body>
  <slot />
</body>
</html>
```

### index.astro

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import FAQ from '../components/FAQ.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="RifaApp - Tu app de rifas" description="Crea y gestiona rifas fácilmente">
  <Hero />
  <Features />
  <FAQ />
  <Footer />
</Layout>
```

## Paso 6: Mostrar versión en la landing

Para mostrar la última versión publicada en GitHub desde la landing:

### Opción A: Server-side fetch (Astro SSR o prebuild)

En `Footer.astro` o componente "última versión":

```astro
---
// Esto corre en build time
const res = await fetch('https://api.github.com/repos/anomalyco/rifa-app/releases/latest', {
  headers: { 'Accept': 'application/vnd.github.v3+json' }
});
const release = res.ok ? await res.json() : null;
const version = release?.tag_name ?? 'v1.0.0';
---

<p class="text-sm text-gray-500">
  Última versión: <a href={release?.html_url ?? '#'} target="_blank">{version}</a>
</p>
```

### Opción B: Cliente-side con fetch

```astro
<p id="version-badge" class="text-sm text-gray-500">Versión: cargando...</p>

<script>
  fetch('https://api.github.com/repos/anomalyco/rifa-app/releases/latest')
    .then(r => r.json())
    .then(release => {
      document.getElementById('version-badge').innerHTML =
        `Versión: <a href="${release.html_url}" target="_blank">${release.tag_name}</a>`;
    })
    .catch(() => {
      document.getElementById('version-badge').textContent = 'Versión: 1.0.0';
    });
</script>
```

### Opción C: Archivo JSON versionado (más control)

Crear `apps/landing/src/version.json`:

```json
{
  "version": "1.0.0",
  "downloadUrl": "https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk",
  "updatedAt": "2026-06-20"
}
```

En el componente:

```astro
---
import { version, downloadUrl } from '../version.json';
---
<a href={downloadUrl}>Descargar v{version}</a>
```

En el CI (GitHub Action), cuando se crea un release, se actualiza este JSON automáticamente.

## Paso 7: Enlace de descarga directa

El enlace permanente para el APK más reciente:

```
https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk
```

**Importante:** Para que funcione, el workflow de release debe subir el APK con el nombre `app-release.apk` (no `app-release (1).apk`).

```yaml
- uses: softprops/action-gh-release@v2
  with:
    files: app-release.apk
```

Eso genera automáticamente el enlace directo que puedes poner en la landing y en la app.

## Paso 8: Preview y build

```bash
pnpm landing:dev       # dev server en http://localhost:4321
pnpm landing:build     # build a apps/landing/dist/
pnpm landing:preview   # preview del build
```

## Estructura final de apps/landing/

```
apps/landing/
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── FAQ.astro
│   │   ├── Footer.astro
│   │   ├── Navbar.astro
│   │   └── VersionBadge.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```
