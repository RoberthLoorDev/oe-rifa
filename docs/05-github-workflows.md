# GitHub Actions Workflows

## Requisitos

- Monorepo con pnpm configurado
- Cuenta en Expo con proyecto configurado
- Cuenta en Vercel (para landing)
- `EXPO_TOKEN` en GitHub Secrets (generado desde [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens))

---

## Workflow 1: Mobile CI (lint + typecheck)

`.github/workflows/mobile.yml`

Se ejecuta en cada push a `main` con cambios en `apps/mobile/`, y en cada PR.

```yaml
name: Mobile CI

on:
  push:
    branches: [main]
    paths:
      - "apps/mobile/**"
      - ".github/workflows/mobile.yml"
  pull_request:
    paths:
      - "apps/mobile/**"

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - run: pnpm --filter @rifa-app/mobile lint
      - run: pnpm --filter @rifa-app/mobile typecheck
```

**Tiempo estimado:** ~30 segundos.
**Consumo de minutos:** insignificante.

---

## Workflow 2: Mobile Release (APK + GitHub Release)

`.github/workflows/mobile-release.yml`

Se ejecuta SOLO cuando se pushea un tag tipo `v1.2.3`.

```yaml
name: Mobile Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build APK with EAS Build
        run: |
          pnpm --filter @rifa-app/mobile eas build \
            -p android \
            --profile production \
            --non-interactive \
            --wait

      - name: Download APK
        run: |
          pnpm --filter @rifa-app/mobile eas build:download \
            -p android \
            --latest \
            --output app-release.apk

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: app-release.apk
          generate_release_notes: true
          name: Release ${{ github.ref_name }}
          body_path: CHANGELOG.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Notas:**
- `--wait` hace que el runner espere ~20 min a que EAS termine.
- El APK se descarga con `eas build:download`.
- `softprops/action-gh-release` lo sube a GitHub Releases.
- `generate_release_notes: true` genera notas automáticas desde los commits (opcional: usar CHANGELOG.md).

---

## Workflow 3: Landing Deploy (Vercel)

`.github/workflows/landing.yml`

Se ejecuta en cada push a `main` con cambios en `apps/landing/`.

```yaml
name: Landing Deploy

on:
  push:
    branches: [main]
    paths:
      - "apps/landing/**"
      - ".github/workflows/landing.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - run: pnpm --filter @rifa-app/landing build

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: apps/landing
```

**Alternativa más simple:** Conectar el repo directamente a Vercel (sin GitHub Action intermedio).

### Setup manual en Vercel:

1. Ve a [vercel.com](https://vercel.com)
2. Importa `anomalyco/rifa-app`
3. Configura:
   - **Root Directory:** `apps/landing`
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`
4. Vercel detecta automáticamente los cambios y deploya

Con esta opción, **no necesitas el workflow 3**. Vercel maneja el deploy por su cuenta.

---

## Workflow 4: Landing Deploy (Vercel + pnpm)

Si decides usar GitHub Action en vez del deploy automático de Vercel, necesitas un `vercel.json` dentro de `apps/landing/`:

```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

---

## Resumen de workflows

| Workflow | Trigger | Tiempo | Minutos GitHub |
|---|---|---|---|
| Mobile CI | Push a main (cambios en mobile/) | ~30s | ~0.5 min |
| Mobile CI | PR a main | ~30s | ~0.5 min |
| Mobile Release | Tag `v*` | ~20 min | ~20 min |
| Landing Deploy | Push a main (cambios en landing/) | ~1 min | ~1 min |

**Consumo mensual estimado:**
- 10 pushes a main con cambios en mobile: 10 × 0.5 = **5 min**
- 5 PRs: 5 × 0.5 = **2.5 min**
- 2 releases: 2 × 20 = **40 min**
- 10 pushes a landing: 10 × 1 = **10 min**

**Total: ~57.5 min/mes de 2000 disponibles.** No hay problema.

---

## Secrets necesarios en GitHub

| Secret | De dónde se obtiene |
|---|---|
| `EXPO_TOKEN` | https://expo.dev/settings/access-tokens |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `vercel projects list` o dashboard |
| `VERCEL_PROJECT_ID` | `vercel projects list` o dashboard |
