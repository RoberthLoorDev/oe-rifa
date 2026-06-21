# Code Style
- Do NOT add comments to code unless the logic is genuinely complex (e.g. the draw components). Avoid inline comments on every line.
- Respect existing design tokens and colors from `tailwind.config.mjs` and `src/constants/theme.ts`.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Monorepo

This is a pnpm monorepo. Structure:
- `apps/mobile/` - Expo app
- `apps/landing/` - Astro landing page

Commands:
- `pnpm mobile:start` - Expo dev
- `pnpm mobile:android` - Expo Android build
- `pnpm landing:dev` - Astro dev
- `pnpm landing:build` - build Astro
- `pnpm -r typecheck` - typecheck all
- `pnpm -r lint` - lint all

# Versioning

## Bump version
To bump version (patch|minor|major):
1. Read current version from `apps/mobile/app.json`
2. Calculate new version per SemVer
3. Update `version` and increment `versionCode` in `apps/mobile/app.json`
4. Update or create `CHANGELOG.md` with categorized commits since last tag
5. Create git tag `v<new-version>`
6. Tell user to `git push origin main --tags`

## Generate changelog
When asked "generate changelog":
1. Read commits since last tag with `git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"- %s"`
2. Categorize: feat=Added, fix=Fixed, BREAKING=Changed
3. Show it to user or write to CHANGELOG.md

# CI/CD – GitHub Actions

## Workflows

### `.github/workflows/mobile-ci.yml`
- **Trigger:** Push a `main` o PR con cambios en `apps/mobile/`
- **Qué hace:** `pnpm lint` + `pnpm typecheck` en el paquete `@oe-rifa/mobile`
- **Duración:** ~30s
- **No genera APK**

### `.github/workflows/mobile-release.yml`
- **Trigger:** Push de tag `v*` (ej: `git tag v1.0.1 && git push origin main --tags`)
- **Qué hace:**
  1. `eas build -p android --profile production --wait` (build APK en Expo Cloud, ~20 min)
  2. `eas build:download --latest --output app-release.apk`
  3. Crea GitHub Release con el APK adjunto y el contenido de `CHANGELOG.md` como descripción
- **Requiere:** `EXPO_TOKEN` en GitHub Secrets
- **APK público en:** `https://github.com/RoberthLoorDev/oe-rifa/releases/latest/download/app-release.apk`

### Landing page (Vercel)
- No usa GitHub Action. Conectada directo a Vercel desde el repo.
- **Root directory:** `apps/landing`
- Auto-deploy al pushear a `main`

## Flujo de release
```
1. git commit -m "feat: ..."
   git push origin main
   → mobile-ci (lint + typecheck)

2. (Opcional) "generate changelog"
   → actualizo CHANGELOG.md con commits desde último tag

3. git add -A && git commit -m "chore: release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   → mobile-release (EAS Build → APK → GitHub Release)
```

## Secrets necesarios
| Secret | Estado |
|---|---|
| `EXPO_TOKEN` | ✅ Configurado |
| `VERCEL_TOKEN` | ❌ No necesario (Vercel directo) |
| `VERCEL_ORG_ID` | ❌ No necesario |
| `VERCEL_PROJECT_ID` | ❌ No necesario |

## Notas
- El APK solo se genera con tags, no en pushes normales
- `CHANGELOG.md` debe existir en la raíz para que `body_path` no falle
- `eas.json` en `apps/mobile/` con perfil `production` (buildType: apk)
