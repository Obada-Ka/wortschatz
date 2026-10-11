import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

// Every feature module lives in src/features/<name>. Add new features here and the
// "features never import each other" zones below are generated automatically.
const FEATURES = ['vocab', 'import', 'auth', 'study']

const featureIsolationZones = FEATURES.map((feature) => ({
  target: `./src/features/${feature}`,
  from: FEATURES.filter((other) => other !== feature).map((other) => `./src/features/${other}`),
  message: `features/${feature} cannot import from other features. Compose features at the page level instead.`
}))

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.history/**', 'scripts/legacy/**']
  },

  js.configs.recommended,

  // Type-checked rules — required for no-unsafe-* (real type info, not
  // just syntax parsing) to catch `any` leaking through inference.
  ...tseslint.configs.recommendedTypeChecked,

  ...vue.configs['flat/recommended'],

  // Config files (vite.config.ts, eslint.config.js) aren't covered by
  // tsconfig.app.json, so they don't get type-aware linting.
  {
    files: ['*.config.ts', '*.config.js'],
    ...tseslint.configs.disableTypeChecked
  },

  // Node scripts (data conversion / validation) are covered by tsconfig.node.json.
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: { ...globals.node }
    }
  },

  {
    // Type-checked linting applies to files covered by tsconfig.app.json (src/**).
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json'
        }
      }
    },
    rules: {
      // ─────────────────────────────────────────────
      // BAN `any` — no escape hatch from the type system.
      // Sanctioned alternative: `unknown` + narrowing, or a zod schema
      // at the boundary (see src/lib/loadVocab.ts for the pattern).
      // ─────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true }
      ],

      // ─────────────────────────────────────────────
      // LAYER BOUNDARY ENFORCEMENT
      // domain/composables/lib/utils → foundation, depend on nothing above them
      // components → foundation only (design-system layer)
      // features   → components + foundation, never other features, never pages
      // pages      → features/components/foundation (top of the stack)
      // ─────────────────────────────────────────────
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/components',
              from: ['./src/features', './src/pages'],
              message:
                'components/ is the design-system layer — it cannot depend on features/ or pages/. Move shared logic into composables/ or utils/ instead.'
            },
            {
              target: ['./src/domain', './src/composables', './src/lib', './src/utils'],
              from: ['./src/features', './src/pages', './src/components'],
              message:
                'domain/, composables/, lib/, and utils/ are foundation layers — they cannot depend on components/, features/, or pages/.'
            },
            {
              target: './src/features',
              from: './src/pages',
              message:
                'features/ cannot depend on pages/. Pages compose features, not the other way around.'
            },
            {
              // Only layers OUTSIDE features/ are restricted to the barrel —
              // files inside a feature may freely import their own siblings.
              target: [
                './src/app',
                './src/pages',
                './src/components',
                './src/composables',
                './src/lib',
                './src/utils'
              ],
              // Direct children other than the barrel, plus anything in sub-folders.
              from: ['./src/features/*/!(index.ts)', './src/features/*/*/**'],
              message:
                "Do not import a feature's internals directly. Import from the feature's public API (e.g. '@/features/vocab') instead of reaching into its components/composables/store."
            },
            ...featureIsolationZones
          ]
        }
      ],

      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-self-import': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },

  // Test files: relax return-type strictness (test bodies are verbose enough)
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  // Disable stylistic rules that conflict with Prettier
  {
    rules: {
      ...(await import('eslint-config-prettier')).default.rules
    }
  }
)
