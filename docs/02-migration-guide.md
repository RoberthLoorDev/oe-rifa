# Migration Guide: npm → pnpm + Monorepo

## Prerequisitos

- Node.js 20+
- Git
- El proyecto funcionando en su estado actual

## Paso 1: Instalar pnpm globalmente

```bash
npm install -g pnpm
pnpm --version  # verificar
```

## Paso 2: Crear estructura monorepo

```bash
# 1. Crear carpeta apps/
mkdir apps

# 2. Crear carpeta mobile/ dentro de apps/
mkdir apps/mobile

# 3. Mover TODO el contenido actual (excepto node_modules, .git, y lo listado abajo) a apps/mobile/
#    Usando PowerShell:
$exclude = @('.git', 'node_modules', 'apps', 'docs', '.github')
Get-ChildItem -Path . -Directory | Where-Object { $_.Name -notin $exclude } | Move-Item -Destination apps/mobile/
Get-ChildItem -Path . -File | Where-Object { $_.Name -notin @('.gitignore', 'package-lock.json') } | Move-Item -Destination apps/mobile/
```

**Quedan en la raíz:**
- `.git/`
- `apps/` (recién creada)
- `docs/` (si existe)
- `.github/` (si existe)
- `.gitignore` (se actualiza)
- `package.json` (nuevo, raíz)
- `pnpm-workspace.yaml` (nuevo)

## Paso 3: Configurar pnpm-workspace.yaml

Crear en raíz `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
```

## Paso 4: Actualizar apps/mobile/package.json

```diff
- "name": "temp-expo-app",
+ "name": "@rifa-app/mobile",
- "main": "expo-router/entry",    # ← se queda igual
```

Agregar script de typecheck si no existe:

```json
"scripts": {
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "typecheck": "tsc --noEmit",
  "reset-project": "node ./scripts/reset-project.js"
}
```

## Paso 5: Crear root package.json

```json
{
  "name": "rifa-app",
  "private": true,
  "scripts": {
    "mobile": "pnpm --filter @rifa-app/mobile",
    "mobile:start": "pnpm --filter @rifa-app/mobile start",
    "mobile:android": "pnpm --filter @rifa-app/mobile android",
    "mobile:ios": "pnpm --filter @rifa-app/mobile ios",
    "mobile:lint": "pnpm --filter @rifa-app/mobile lint",
    "mobile:typecheck": "pnpm --filter @rifa-app/mobile typecheck"
  },
  "engines": {
    "node": ">=20"
  }
}
```

## Paso 6: Actualizar .gitignore

```diff
+ # root
+ node_modules/
+ .expo/
+ dist/
+ web-build/
+
+ # apps/mobile
+ apps/mobile/node_modules/
+ apps/mobile/.expo/
+ apps/mobile/web-build/
+ apps/mobile/android/.gradle/
+ apps/mobile/android/app/build/
+
+ # apps/landing
+ apps/landing/node_modules/
+ apps/landing/dist/
+
- # ya no aplican en la raíz, se mueven a apps/mobile/.gitignore
- node_modules/
- .expo/
- dist/
- web-build/
...
```

**O mejor:** mantén el `.gitignore` original dentro de `apps/mobile/` y crea uno nuevo en la raíz solo con lo necesario.

## Paso 7: Actualizar apps/mobile/tsconfig.json

Verificar que los paths sigan funcionando:

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

**Importante:** Los paths `@/*` se resuelven contra `apps/mobile/src/`. Como el `tsconfig.json` está dentro de `apps/mobile/`, el path `./src/` es correcto.

## Paso 8: Instalar dependencias con pnpm

```bash
# 1. Borrar node_modules y lockfile viejos
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 2. Instalar con pnpm
pnpm install
```

Esto genera `pnpm-lock.yaml` y crea los `node_modules` necesarios.

## Paso 9: Verificar que todo funciona

```bash
# 1. Typecheck
cd apps/mobile
npx tsc --noEmit
# o desde raíz:
pnpm mobile:typecheck

# 2. Lint
pnpm mobile:lint

# 3. Probar que arranque
pnpm mobile:start
```

## Paso 10: Commit inicial del monorepo

```bash
git add -A
git commit -m "chore: migrate to pnpm monorepo

- Move app to apps/mobile/
- Add pnpm-workspace.yaml
- Add root package.json with workspace scripts
- Convert from npm to pnpm"
```

## Rollback (si algo sale mal)

```bash
# Si necesitas revertir el monorepo:
# 1. Mueve todo de vuelta a la raíz
# 2. Borra pnpm-workspace.yaml y el root package.json
# 3. Restaura package-lock.json (git checkout package-lock.json)
# 4. npm install
```

## Checklist final

- [ ] pnpm global instalado
- [ ] `apps/mobile/` con todo el código
- [ ] `pnpm-workspace.yaml` creado
- [ ] Root `package.json` creado
- [ ] `apps/mobile/package.json` con name `@rifa-app/mobile`
- [ ] `pnpm install` sin errores
- [ ] `pnpm mobile:typecheck` pasa
- [ ] `pnpm mobile:lint` pasa
- [ ] `pnpm mobile:start` arranca
- [ ] `.gitignore` actualizado
- [ ] Commit hecho
