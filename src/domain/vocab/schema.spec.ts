import { loadVocab } from '@/lib/loadVocab'

import { modalKey, nounKey, verbKey } from './keys'
import { nounSchema, verbSchema, vocabFileSchema } from './schema'

describe('seed data', () => {
  it('is valid and keeps every entry from the original HTML', async () => {
    const data = await loadVocab()
    expect(data.nouns).toHaveLength(97)
    expect(data.verbs).toHaveLength(88)
    expect(data.modals).toHaveLength(7)
  })

  it('contains no duplicate entries', async () => {
    const { nouns, verbs, modals } = await loadVocab()
    expect(new Set(nouns.map(nounKey)).size).toBe(nouns.length)
    expect(new Set(verbs.map(verbKey)).size).toBe(verbs.length)
    expect(new Set(modals.map(modalKey)).size).toBe(modals.length)
  })

  it('converts legacy plural markers', async () => {
    const { nouns } = await loadVocab()
    expect(nouns.find((noun) => noun.word === 'Spaß')).toMatchObject({
      plural: null,
      pluralOnly: false
    })
    expect(nouns.find((noun) => noun.word === 'Leute')).toMatchObject({
      plural: null,
      pluralOnly: true
    })
  })

  it('splits present tense and governed cases into structured data', async () => {
    const { verbs } = await loadVocab()
    expect(verbs.find((verb) => verb.infinitive === 'anfangen')?.present).toEqual({
      ich: 'fange an',
      er: 'fängt an'
    })
    expect(verbs.find((verb) => verb.infinitive === 'fliegen')?.takes).toEqual([
      { case: 'Dat', prepositions: ['nach'] }
    ])
    expect(verbs.find((verb) => verb.infinitive === 'kommen')?.takes).toEqual([
      { case: 'Dat', prepositions: ['aus', 'nach'] }
    ])
  })
})

describe('schemas', () => {
  const noun = {
    article: 'der',
    word: 'Tisch',
    plural: 'Tische',
    case: 'Akk',
    meaning: 'table',
    example: 'Ich kaufe einen Tisch.'
  }

  it('applies defaults to optional fields', () => {
    expect(nounSchema.parse(noun).pluralOnly).toBe(false)
  })

  it('rejects an unknown article', () => {
    expect(nounSchema.safeParse({ ...noun, article: 'den' }).success).toBe(false)
  })

  it('rejects blank text', () => {
    expect(nounSchema.safeParse({ ...noun, meaning: '   ' }).success).toBe(false)
  })

  it('rejects a verb with an unknown auxiliary', () => {
    const verb = {
      infinitive: 'gehen',
      meaning: 'to go',
      present: { ich: 'gehe', er: 'geht' },
      auxiliary: 'werden',
      participle: 'gegangen',
      preterite: 'ging',
      example: 'Wir gehen.'
    }
    expect(verbSchema.safeParse(verb).success).toBe(false)
  })

  it('requires the file version and defaults missing sections to empty', () => {
    expect(vocabFileSchema.safeParse({ nouns: [] }).success).toBe(false)
    expect(vocabFileSchema.parse({ version: 1 })).toEqual({
      version: 1,
      nouns: [],
      verbs: [],
      modals: []
    })
  })
})
