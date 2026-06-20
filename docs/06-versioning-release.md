# Versioning, Changelog & Release Automation

## 1. Semantic Versioning (SemVer)

Formato: **MAJOR.MINOR.PATCH**

```
v2.5.3
↑  ↑  ↑
│  │  └── PATCH: bug fixes (retrocompatible)
│  └───── MINOR: nuevas features (retrocompatible)
└──────── MAJOR: cambios que rompen compatibilidad
```

| Ejemplo | Cambio |
|---|---|
| `1.0.0` → `1.0.1` | Arreglaste un bug |
| `1.0.0` → `1.1.0` | Agregaste una feature nueva |
| `1.0.0` → `2.0.0` | Cambiaste algo que rompe lo anterior |

### ¿Cómo decidir?

Pregúntate: **¿esto requiere que los usuarios actualicen su app?**
- Si solo arreglaste un error visual → **PATCH** (1.0.0 → 1.0.1)
- Si agregaste "compartir en redes sociales" → **MINOR** (1.0.0 → 1.1.0)
- Si cambiaste la base de datos y usuarios anteriores pierden datos → **MAJOR** (1.0.0 → 2.0.0)

### ¿Cuándo versionar?

**No versiones en cada commit.** Versionas cuando **publicas un release**. El workflow con tags:

```bash
# 1. Cuando tengas cambios listos para publicar
git add -A
git commit -m "feat: add share to social media"

# 2. Crear tag con el nuevo version
git tag v1.1.0

# 3. Push (esto dispara el workflow de release)
git push origin main --tags
```

---

## 2. Conventional Commits (para changelog automático)

Formato estandarizado de mensajes de commit que permite generar changelogs automáticamente:

```
<tipo>: <descripción>

[optional body]
```

| Tipo | Release | Changelog |
|---|---|---|
| `feat:` | MINOR | New Features |
| `fix:` | PATCH | Bug Fixes |
| `chore:` | — | no aparece |
| `docs:` | — | no aparece |
| `refactor:` | — | no aparece |
| `perf:` | PATCH | Performance |
| `style:` | — | no aparece |
| `test:` | — | no aparece |
| `BREAKING CHANGE` | MAJOR | Breaking Changes |

Ejemplos:

```
feat: add share ticket to WhatsApp
fix: crash when drawing winner with no tickets
chore: update dependencies
BREAKING CHANGE: migrate database schema v2
```

---

## 3. Changelog automation

### Opción A: Manual con AI (la que pides)

Mantén un `CHANGELOG.md` en la raíz. Cuando toques el tag, le pides a la IA algo como:

> "Basado en los commits desde v1.0.0 hasta ahora, genera el changelog para v1.1.0"

O automatizas con un script:

```bash
# Script para generar changelog desde el último tag
git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"- %s"
```

### Opción B: Automático con standard-version

```bash
pnpm add -Dw standard-version
```

Agregar script al root package.json:

```json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  }
}
```

Flujo:

```bash
# 1. Haces commits convencionales
git commit -m "feat: add dark mode"
git commit -m "fix: fix typo in header"

# 2. Corres standard-version
pnpm release
# Esto:
#   - Calcula el nuevo version (ej: v1.0.0 → v1.1.0)
#   - Actualiza CHANGELOG.md
#   - Actualiza version en package.json
#   - Crea el commit de release
#   - Crea el tag

# 3. Push
git push --follow-tags origin main
```

### Opción C: semantic-release (full CI)

Más complejo pero 100% automático. En cada push a main, analiza commits, versiona, genera changelog, y publica release.

```bash
pnpm add -Dw semantic-release @semantic-release/github @semantic-release/changelog
```

No recomendado para empezar. Empieza con **Opción A o B**.

---

## 4. Flujo de release completo

```
Desarrollo normal
  │
  ├── git commit -m "feat: ..."      ← conventional commits
  ├── git commit -m "fix: ..."
  │
  └── Llega el momento de publicar

        ├── Opción manual
        │   └── pnpm release                    ← standard-version calcula version
        │       ├── Actualiza CHANGELOG.md       ← genera changelog
        │       ├── Actualiza package.json       ← bump version
        │       └── Crea tag v1.1.0
        │
        └── Opción manual alternativa
            └── git tag v1.0.1                   ← tú pones el version

  git push origin main --tags
  │
  └── GitHub Action (mobile-release.yml)
      ├── eas build --wait                       ← build APK en Expo Cloud (~20 min)
      ├── eas build:download                     ← descarga APK
      └── action-gh-release                      ← sube APK a GitHub Releases
          ├── APK descargable: app-release.apk
          └── Release notes del changelog
```

---

## 5. Enlace de descarga directa

Una vez que el workflow sube el APK, el enlace permanente es:

```
https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk
```

Este enlace SIEMPRE apunta al APK más reciente, sin importar el tag.

### En la app mobile

Puedes poner un botón "Actualizar" o "Verificar versión" que apunte a este enlace:

```ts
const LATEST_APK_URL =
  "https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk";
```

### En la landing page

```astro
<a
  href="https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk"
  class="btn-download"
>
  Descargar RifaApp
</a>
```

---

## 6. App version en app.json

`apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "RifaApp",
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

- `version` → versión visible para usuarios (se sincroniza con el tag)
- `versionCode` → número entero incremental (solo Android, necesario para Play Store)

Al hacer release:
- `version` se actualiza a `1.1.0` (si MINOR) o `1.0.1` (si PATCH)
- `versionCode` se incrementa en 1

Si usas `standard-version`, puedes configurarlo para que actualice `app.json` también:

```json
// .versionrc.json
{
  "bumpFiles": [
    "package.json",
    "apps/mobile/app.json"
  ]
}
```

---

## 7. CHANGELOG.md (en la raíz)

```markdown
# Changelog

## [1.1.0] - 2026-07-01

### Added
- Compartir tickets por WhatsApp
- Filtro por estado en lista de rifas
- Búsqueda por nombre de participante

### Fixed
- Crash al seleccionar ganador sin tickets
- Número de ganador no visible después de animación

## [1.0.0] - 2026-06-01

### Added
- Lanzamiento inicial
- Creación y gestión de rifas
- Sorteo con ruleta animada
- Compartir resultados como imagen
```

---

## 8. Resumen de comandos de release

```bash
# Desarrollo normal (commits convencionales)
git commit -m "feat: add dark mode"
git commit -m "fix: crash en sorteo"

# Hacer release (opción standard-version)
pnpm release        # auto: determina si es major/minor/patch
pnpm release:minor  # forzar minor
pnpm release:major  # forzar major

# Hacer release (opción manual)
# 1. Editar app.json y CHANGELOG.md manualmente
# 2. git add -A && git commit -m "chore: release v1.1.0"
git tag v1.1.0

# Publicar
git push origin main --tags
# → GitHub Action build APK + sube a Releases
```

## 9. AI-assisted versioning (AGENTS.md)

Agrega esto a `AGENTS.md` para que la IA te ayude:

```markdown
## Versioning

### Bump version
Pídeme: "bump version [patch|minor|major]" y yo:
1. Actualizo app.json (version + versionCode)
2. Actualizo CHANGELOG.md
3. Creo el tag
4. Te doy el comando para pushear

### Generate changelog
Pídeme: "generate changelog" y yo:
1. Leo los commits desde el último tag
2. Categorizo feat/fix/breaking
3. Actualizo CHANGELOG.md

### Check current version
Pídeme: "what version?" y te digo el version actual.
```
