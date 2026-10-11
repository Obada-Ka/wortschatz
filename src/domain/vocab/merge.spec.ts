import { mergeVocab } from './merge'
import type { Noun, VocabData } from './schema'

const noun = (overrides: Partial<Noun> = {}): Noun => ({
  article: 'der',
  word: 'Tisch',
  plural: 'Tische',
  pluralOnly: false,
  case: 'Akk',
  meaning: 'table',
  example: 'Ich kaufe einen Tisch.',
  ...overrides
})

const data = (nouns: Noun[]): VocabData => ({ version: 1, nouns, verbs: [], modals: [] })

describe('mergeVocab', () => {
  it('adds entries that do not exist yet', () => {
    const result = mergeVocab(data([noun()]), data([noun({ word: 'Stuhl', meaning: 'chair' })]))
    expect(result.data.nouns.map((entry) => entry.word)).toEqual(['Tisch', 'Stuhl'])
    expect(result.report.nouns.added).toEqual(['der:stuhl'])
  })

  it('reports identical entries as unchanged and does not duplicate them', () => {
    const result = mergeVocab(data([noun()]), data([noun()]))
    expect(result.data.nouns).toHaveLength(1)
    expect(result.report.nouns.unchanged).toEqual(['der:tisch'])
  })

  it('treats the same word with a different article as a different noun', () => {
    const result = mergeVocab(
      data([noun({ word: 'See', meaning: 'lake' })]),
      data([noun({ article: 'die', word: 'See', meaning: 'sea' })])
    )
    expect(result.data.nouns).toHaveLength(2)
  })

  it('keeps the existing entry on conflict by default', () => {
    const result = mergeVocab(data([noun()]), data([noun({ meaning: 'desk' })]))
    expect(result.report.nouns.conflicting).toEqual(['der:tisch'])
    expect(result.data.nouns[0]?.meaning).toBe('table')
  })

  it('overwrites on conflict when asked to', () => {
    const result = mergeVocab(data([noun()]), data([noun({ meaning: 'desk' })]), 'overwrite')
    expect(result.data.nouns[0]?.meaning).toBe('desk')
  })

  it('does not mutate its inputs', () => {
    const existing = data([noun()])
    const snapshot = JSON.stringify(existing)
    mergeVocab(existing, data([noun({ word: 'Stuhl' })]))
    expect(JSON.stringify(existing)).toBe(snapshot)
  })

  it('ignores duplicates inside the uploaded file after the first one', () => {
    const result = mergeVocab(data([]), data([noun(), noun()]))
    expect(result.data.nouns).toHaveLength(1)
    expect(result.report.nouns.unchanged).toEqual(['der:tisch'])
  })
})
