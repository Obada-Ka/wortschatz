/**
 * One-time converter: reads the positional-array data embedded in the legacy
 * german_case_vocab.html and writes the validated JSON used by the app.
 *
 *   npm run convert:legacy
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { z } from 'zod'

import { vocabFileSchema } from '../src/domain/vocab/schema.ts'
import type { VocabData } from '../src/domain/vocab/schema.ts'

const SOURCE = 'scripts/legacy/german_case_vocab.html'
const TARGET = 'src/data/vocab.seed.json'

const html = readFileSync(SOURCE, 'utf-8')

function extract(name: string, pattern: RegExp): unknown {
  const match = pattern.exec(html)
  if (!match?.[1]) throw new Error(`Could not find "${name}" in ${SOURCE}`)
  return JSON.parse(match[1]) as unknown
}

const s = z.string()
const nounRows = z.array(z.tuple([s, s, s, s, s, s])).parse(extract('N', /var N=(\[[\s\S]*?\n\]);/))
const verbRows = z
  .array(z.tuple([s, s, s, s, s, s, s, s, s]))
  .parse(extract('V', /var V=(\[[\s\S]*?\n\]);/))
const modalRows = z
  .array(z.tuple([s, s, z.array(s), z.array(s)]))
  .parse(extract('M', /var M=(\[[\s\S]*?\n\]);/))
const modalTenses = z.record(z.string(), z.tuple([s, s])).parse(extract('T', /var T=(\{[^\n]*\});/))

const PLURAL_ONLY = '(only plural)'
const NO_PLURAL = '–'

/** "aus / nach + Dat" -> [{ prepositions: [aus, nach], case: Dat }]; "Dat + Akk" -> two entries. */
function parseTakes(raw: string): { case: string; prepositions: string[] }[] {
  if (raw === '') return []
  const cases = new Set(['Akk', 'Dat', 'Gen'])
  const parts = raw.split(' + ')
  const result: { case: string; prepositions: string[] }[] = []

  if (parts.every((part) => cases.has(part))) {
    return parts.map((part) => ({ case: part, prepositions: [] }))
  }
  const caseName = parts[parts.length - 1]
  const prepositions = parts.slice(0, -1).join(' + ')
  if (parts.length === 2 && caseName && cases.has(caseName)) {
    result.push({ case: caseName, prepositions: prepositions.split(' / ') })
    return result
  }
  throw new Error(`Unrecognised "takes" value: ${raw}`)
}

function splitPresent(raw: string): { ich: string; er: string } {
  const [ich, er, ...rest] = raw.split(' / ')
  if (!ich || !er || rest.length > 0) throw new Error(`Unrecognised present tense: ${raw}`)
  return { ich, er }
}

const data: VocabData = vocabFileSchema.parse({
  version: 1,
  nouns: nounRows.map(([article, word, plural, grammarCase, meaning, example]) => ({
    article,
    word,
    plural: plural === NO_PLURAL || plural === PLURAL_ONLY ? null : plural,
    pluralOnly: plural === PLURAL_ONLY,
    case: grammarCase,
    meaning,
    example
  })),
  verbs: verbRows.map(
    ([infinitive, meaning, present, auxiliary, participle, preterite, takes, tags, example]) => ({
      infinitive,
      meaning,
      present: splitPresent(present),
      auxiliary,
      participle,
      preterite,
      takes: parseTakes(takes),
      tags: tags === '' ? [] : tags.split(', '),
      example
    })
  ),
  modals: modalRows.map(([infinitive, meaning, present, examples]) => {
    const tense = modalTenses[infinitive]
    if (!tense) throw new Error(`No Präteritum/Perfekt entry for modal "${infinitive}"`)
    return { infinitive, meaning, present, examples, preterite: tense[0], perfekt: tense[1] }
  })
})

writeFileSync(TARGET, JSON.stringify(data, null, 2) + '\n')
console.log(
  `Wrote ${TARGET}: ${data.nouns.length} nouns, ${data.verbs.length} verbs, ${data.modals.length} modals`
)
