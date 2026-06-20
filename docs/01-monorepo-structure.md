# Monorepo Structure — RifaApp

## Directory layout

```
rifa-app/                          # ← raíz del repositorio (único git)
├── apps/
│   ├── mobile/                    # ← app Expo (React Native)
│   │   ├── src/                   #    código fuente
│   │   │   ├── app/               #    Expo Router screens
│   │   │   ├── components/        #    componentes UI
│   │   │   ├── database/          #    SQLite
│   │   │   ├── hooks/             #    custom hooks
│   │   │   ├── repositories/      #    data access
│   │   │   ├── services/          #    business logic
│   │   │   ├── types/             #    TypeScript types
│   │   │   ├── utils/             #    helpers
│   │   │   └── global.css         #    Tailwind
│   │   ├── assets/                #    imágenes, fuentes
│   │   ├── app.json               #    Expo config
│   │   ├── metro.config.js
│   │   ├── babel.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json           #    deps de mobile
│   └── landing/                   # ← landing page (Astro)
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   └── layouts/
│       ├── public/
│       ├── astro.config.mjs
│       ├── tailwind.config.mjs
│       ├── tsconfig.json
│       └── package.json           #    deps de landing
├── .github/
│   └── workflows/
│       ├── mobile.yml             # CI/CD app mobile
│       └── landing.yml            # CI/CD landing page
├── docs/                          # documentación
│   ├── 01-monorepo-structure.md
│   ├── 02-migration-guide.md
│   ├── 03-turborepo-setup.md
│   ├── 04-astro-landing-setup.md
│   ├── 05-github-workflows.md
│   └── 06-versioning-release.md
├── pnpm-workspace.yaml            # define los workspaces
├── package.json                   # raíz (solo scripts + workspaces)
├── .gitignore
├── AGENTS.md
└── README.md
```

## pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
```

## Root package.json

```json
{
  "name": "rifa-app",
  "private": true,
  "scripts": {
    "mobile": "pnpm --filter mobile",
    "landing": "pnpm --filter landing",
    "mobile:start": "pnpm --filter mobile start",
    "mobile:android": "pnpm --filter mobile android",
    "mobile:ios": "pnpm --filter mobile ios",
    "mobile:lint": "pnpm --filter mobile lint",
    "mobile:typecheck": "pnpm --filter mobile typecheck",
    "landing:dev": "pnpm --filter landing dev",
    "landing:build": "pnpm --filter landing build",
    "landing:preview": "pnpm --filter landing preview",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  }
}
```

## Comandos diarios

```bash
# Development
pnpm mobile:start          # Expo dev server
pnpm landing:dev           # Astro dev server

# Build
pnpm landing:build         # Build landing (output: apps/landing/dist/)

# Lint/typecheck en ambos
pnpm lint                  # lint en todos los workspaces
pnpm typecheck             # typecheck en todos

# Instalar dependencias (desde apps/mobile/ o apps/landing/)
pnpm --filter mobile add expo-something
pnpm --filter landing add astro-icon
```

## Path aliases

Cada app mantiene sus propios `tsconfig.json` con sus alias:

### apps/mobile/tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### apps/landing/tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## No shared packages (por ahora)

Como no compartes componentes entre mobile y landing, no hay carpeta `packages/shared/`. Si en el futuro necesitas compartir types o utilidades, se agrega sin problema:

```
rifa-app/
├── packages/
│   └── shared/              # types, utils, etc.
├── apps/
│   ├── mobile/
│   └── landing/
```

Cada app lo importa como `@rifa-app/shared` (con pnpm workspace protocol).
