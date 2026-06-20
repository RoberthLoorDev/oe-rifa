# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Monorepo

This is a pnpm monorepo. Structure:
- `apps/mobile/` - Expo app
- `apps/landing/` - Astro landing page

Commands:
- `pnpm mobile:start` - Expo dev
- `pnpm landing:dev` - Astro dev
- `pnpm -r typecheck` - typecheck all

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
