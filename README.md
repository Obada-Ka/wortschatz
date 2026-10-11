# Wortschatz

A personal German vocabulary site: nouns (with article colours), verbs (Präsens, Präteritum, Perfekt, governed cases) and modal verbs. Built with Vue 3, TypeScript and Vite, hosted on Netlify.

## Status

| Phase | Scope                                                               | State |
| ----- | ------------------------------------------------------------------- | ----- |
| 1     | Project setup, CI, Netlify config, schemas, seed data               | Done  |
| 2     | Reader UI: search, filters, article colours, verb tables, dark mode | Done  |
| 3     | Supabase (data + auth), row-level security, roles                   | Next  |
| 4     | Add-word form and validated file upload with preview before merge   | -     |
| 5     | Offline reading (PWA), role management for additional writers       | -     |

Right now the site reads from the bundled `src/data/vocab.seed.json`. Only `src/lib/loadVocab.ts` knows that; phase 3 replaces it with a remote source.

## Tech stack

Vue 3 (`<script setup>`), TypeScript (strict), Vite, Pinia, Vue Router, Tailwind CSS 4, Zod, Vitest + Vue Test Utils, ESLint, Prettier, Husky + lint-staged, Docker Compose.

## Getting started

Requires Node 22 and npm.

```bash
npm install
npm run dev        # http://localhost:5000
```

Or with Docker: `docker-compose up`.

## Scripts

| Script                   | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Dev server with hot reload                                         |
| `npm run build`          | Type-check and production build into `dist/`                       |
| `npm run preview`        | Serve the production build locally                                 |
| `npm test`               | Run all tests once (`test:watch`, `test:coverage` also available)  |
| `npm run lint`           | ESLint, zero warnings allowed                                      |
| `npm run typecheck`      | `vue-tsc` over app and node configs                                |
| `npm run format`         | Prettier (`format:check` in CI)                                    |
| `npm run validate:data`  | Validate vocabulary JSON against the schema                        |
| `npm run convert:legacy` | Rebuild the seed JSON from `scripts/legacy/german_case_vocab.html` |

## Project structure

```
src
├── assets/        global styles and design tokens
├── components/    shared UI (BaseChoice, EmptyState, ThemeToggle)
├── composables/   shared composables (useTheme)
├── data/          vocab.seed.json
├── domain/vocab/  Zod schemas, types, identity keys, mergeVocab
├── features/vocab/  store, filtering, noun/verb/modal views (public API: index.ts)
├── lib/           data loading
├── pages/         VocabPage
├── router/
└── utils/         text helpers (diacritic-insensitive search)
```

**Dependency rule:** `pages → features → components → composables/lib/utils/domain`. Features never import each other, and outside a feature you may only import from its `index.ts`. ESLint enforces this (`import/no-restricted-paths`). To add a feature, add its name to `FEATURES` in `eslint.config.js`.

## Data format

All vocabulary, including files you upload later, uses one schema (`src/domain/vocab/schema.ts`):

```json
{
  "version": 1,
  "nouns": [
    {
      "article": "der",
      "word": "Tisch",
      "plural": "Tische",
      "case": "Akk",
      "meaning": "table",
      "example": "Ich kaufe einen Tisch."
    }
  ],
  "verbs": [
    {
      "infinitive": "fliegen",
      "meaning": "to fly",
      "present": { "ich": "fliege", "er": "fliegt" },
      "auxiliary": "sein",
      "participle": "geflogen",
      "preterite": "flog",
      "takes": [{ "case": "Dat", "prepositions": ["nach"] }],
      "tags": ["irregular"],
      "example": "Ich bin nach Spanien geflogen."
    }
  ],
  "modals": []
}
```

- Entry identity: nouns by article + word, verbs and modals by infinitive. `mergeVocab` uses it to add new entries, skip identical ones, and flag conflicts (keep existing, or overwrite).
- Check a file before uploading it: `npm run validate:data -- path/to/file.json`.

## Deployment (Netlify)

1. Push the repo to GitHub and import it in Netlify. `netlify.toml` already sets the build command, publish folder, Node version, SPA redirect and security headers.
2. Netlify builds a preview for every pull request and deploys `main` to production.
3. In GitHub, mark the **CI / verify** check as required for `main`, so a failing lint, type, data or test run blocks the merge.

CI (`.github/workflows/ci.yml`): format check, lint, type check, data validation, tests, build.
