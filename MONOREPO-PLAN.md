# RifaApp — Plan de Monorepo

## Resumen

Monorepo con **pnpm workspaces**: app Expo (`apps/mobile/`) + landing Astro (`apps/landing/`) en el mismo repositorio.

- **Un solo `git`**, un solo repo (`github.com/anomalyco/rifa-app`)
- Cada app tiene sus propias deps y scripts
- No comparten componentes (por ahora)
- CI/CD independiente por app (path filters en workflows)

## Estructura

```
rifa-app/
├── apps/
│   ├── mobile/          # Expo (React Native)
│   └── landing/         # Astro
├── docs/                # Documentación detallada
└── .github/workflows/   # CI/CD
```

## Documentos detallados

| Documento | Qué cubre |
|---|---|
| `docs/01-monorepo-structure.md` | Directorios, configs, comandos |
| `docs/02-migration-guide.md` | Migrar de npm a pnpm + mover app |
| `docs/03-turborepo-setup.md` | Build cache (opcional, agregar después) |
| `docs/04-astro-landing-setup.md` | Crear y configurar landing con Astro |
| `docs/05-github-workflows.md` | CI/CD: mobile CI, mobile release, landing deploy |
| `docs/06-versioning-release.md` | SemVer, changelog, releases automáticos |

## Deciciones técnicas

| Aspecto | Decisión |
|---|---|
| Package manager | **pnpm** (migrar desde npm) |
| Build APK | **EAS Build** (Expo Cloud, no gasta minutos de GitHub) |
| Deploy landing | **Vercel** (directo o via GitHub Action) |
| APK → GitHub Releases | `eas build --wait` + `action-gh-release` (~20 min por release) |
| Versionado | **SemVer** (MAJOR.MINOR.PATCH) con conventional commits |
| Changelog | Manual con ayuda de AI o `standard-version` |
| Turborepo | Opcional, agregar después |

## Comandos principales

```bash
pnpm mobile:start           # Expo dev server
pnpm mobile:android         # build APK local
pnpm landing:dev            # Astro dev server
pnpm landing:build          # build landing
pnpm -r lint                # lint en todos
pnpm -r typecheck           # typecheck en todos
```

## CI/CD

| Evento | Qué pasa |
|---|---|
| Push a main (mobile/) | Lint + typecheck (~30s) |
| Push a main (landing/) | Deploy a Vercel (~1 min) |
| Tag `v*` | EAS Build APK + GitHub Release (~20 min) |

## Enlace de descarga directa

```
https://github.com/anomalyco/rifa-app/releases/latest/download/app-release.apk
```

## Próximos pasos

Ver `docs/02-migration-guide.md` para empezar la migración.
