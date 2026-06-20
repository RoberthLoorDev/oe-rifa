# Turborepo Setup — Build Cache + Parallel Tasks

## ¿Qué es Turborepo?

Turborepo es un sistema de build cache y orquestación de tareas para monorepos. No reemplaza a pnpm workspaces, sino que se suma.

**Para qué sirve con 2 apps:**
- **Caché de builds:** si no tocaste código de mobile, no rebuildearlo
- **Paralelización:** corre lint + typecheck de ambos proyectos a la vez
- **Pipeline declarativo:** defines el orden (primero lint, luego build)

**¿Lo necesitas?** Con solo 2 apps que no comparten código, es opcional pero recomendado. Cuando llegues a 3+ apps o scripts complejos, se vuelve indispensable.

## Instalación

```bash
pnpm add -Dw turbo
```

## Configuración: turbo.json

Crear en la raíz `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "typecheck": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Actualizar root package.json

```diff
{
  "scripts": {
+   "turbo:build": "turbo build",
+   "turbo:lint": "turbo lint",
+   "turbo:typecheck": "turbo typecheck",
+   "turbo:dev": "turbo dev",
    "mobile": "pnpm --filter @rifa-app/mobile",
    ...
  }
}
```

## Cómo funciona

```bash
# Correr lint en AMBOS proyectos a la vez (paralelo)
pnpm turbo:lint
# equivalente a: turbo lint

# Build en orden (si landing dependiera de mobile, esperaría)
pnpm turbo:build
# equivalente a: turbo build

# Limpiar caché si algo se corrompe
npx turbo clean
```

## Pipeline explicado

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // build de dependencias primero
      "outputs": ["dist/**"]     // qué carpetas cachear
    },
    "lint": {},
    "typecheck": {},
    "dev": {
      "cache": false,            // no cachear dev server
      "persistent": true         // tarea que no termina
    }
  }
}
```

## Remote Caching (opcional, avanzado)

Turborepo puede compartir caché entre desarrolladores y CI usando Vercel Remote Caching:

```bash
npx turbo login
npx turbo link
```

Esto hace que si alguien ya buildéo en CI y tú haces pull, te bajas el caché en vez de rebuildear.

## ¿Conviene ahora o después?

| Situación | Recomendación |
|---|---|
| 2 apps, sin código compartido | Opcional, puedes agregarlo después |
| CI lento (lint + typecheck cada push) | Ayuda porque cachea resultados |
| +3 apps o shared packages | Recomendado |
| Quieres remote caching | Lo agregas en 5 min después |

**Para empezar:** no lo instales aún. Migra primero a pnpm monorepo con Astro funcionando. Cuando sientas que los builds locales son lentos, agregas Turbo en 5 min.
