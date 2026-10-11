import { z } from 'zod'

export const articleSchema = z.enum(['der', 'die', 'das'])
export const caseSchema = z.enum(['Akk', 'Dat', 'Gen'])
export const auxiliarySchema = z.enum(['haben', 'sein'])
export const verbTagSchema = z.enum(['separable', 'irregular', 'reflexive'])

const text = z.string().trim().min(1)

export const nounSchema = z.object({
  article: articleSchema,
  word: text,
  /** `null` when the noun has no plural (e.g. der Spaß) or is plural-only. */
  plural: text.nullable(),
  pluralOnly: z.boolean().default(false),
  /** The case the word appears in within its example sentence. */
  case: caseSchema,
  meaning: text,
  example: text
})

/** What a verb governs: a bare case ("Akk") or preposition(s) + case ("in + Dat"). */
export const verbObjectSchema = z.object({
  case: caseSchema,
  prepositions: z.array(text).default([])
})

export const verbSchema = z.object({
  infinitive: text,
  meaning: text,
  present: z.object({ ich: text, er: text }),
  auxiliary: auxiliarySchema,
  participle: text,
  /** Präteritum, er/sie/es form. */
  preterite: text,
  takes: z.array(verbObjectSchema).default([]),
  tags: z.array(verbTagSchema).default([]),
  example: text
})

const sixForms = z.array(text).length(6)

export const modalSchema = z.object({
  infinitive: text,
  meaning: text,
  /** Present tense in the order of PERSONS. */
  present: sixForms,
  /** One example sentence per person, same order as `present`. */
  examples: sixForms,
  preterite: text,
  perfekt: text
})

/** The shape of both the site's dataset and any file you upload to extend it. */
export const vocabFileSchema = z.object({
  version: z.literal(1),
  nouns: z.array(nounSchema).default([]),
  verbs: z.array(verbSchema).default([]),
  modals: z.array(modalSchema).default([])
})

export const PERSONS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'] as const

export type Article = z.infer<typeof articleSchema>
export type GrammarCase = z.infer<typeof caseSchema>
export type Auxiliary = z.infer<typeof auxiliarySchema>
export type VerbTag = z.infer<typeof verbTagSchema>
export type Noun = z.infer<typeof nounSchema>
export type VerbObject = z.infer<typeof verbObjectSchema>
export type Verb = z.infer<typeof verbSchema>
export type Modal = z.infer<typeof modalSchema>
export type VocabData = z.infer<typeof vocabFileSchema>
