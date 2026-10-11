/**
 * Validates vocabulary JSON files against the Zod schema and checks for duplicate entries.
 * Used by CI, and handy locally before you upload a file generated in chat:
 *
 *   npm run validate:data                     # validates the seed file
 *   npm run validate:data -- path/to/file.json
 */
import { readFileSync } from 'node:fs'

import { modalKey, nounKey, verbKey, vocabFileSchema } from '../src/domain/vocab/index.ts'

const files = process.argv.slice(2)
if (files.length === 0) files.push('src/data/vocab.seed.json')

function findDuplicates(keys: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const key of keys) {
    if (seen.has(key)) duplicates.add(key)
    seen.add(key)
  }
  return [...duplicates]
}

let failed = false

for (const file of files) {
  const raw = JSON.parse(readFileSync(file, 'utf-8')) as unknown
  const result = vocabFileSchema.safeParse(raw)

  if (!result.success) {
    failed = true
    console.error(`✗ ${file}`)
    for (const issue of result.error.issues) {
      console.error(`    ${issue.path.join('.')}: ${issue.message}`)
    }
    continue
  }

  const { nouns, verbs, modals } = result.data
  const duplicates = [
    ...findDuplicates(nouns.map(nounKey)).map((key) => `noun ${key}`),
    ...findDuplicates(verbs.map(verbKey)).map((key) => `verb ${key}`),
    ...findDuplicates(modals.map(modalKey)).map((key) => `modal ${key}`)
  ]

  if (duplicates.length > 0) {
    failed = true
    console.error(`✗ ${file}: duplicate entries: ${duplicates.join(', ')}`)
    continue
  }

  console.log(`✓ ${file}: ${nouns.length} nouns, ${verbs.length} verbs, ${modals.length} modals`)
}

process.exit(failed ? 1 : 0)
