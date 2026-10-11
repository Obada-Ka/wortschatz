import { modalKey, nounKey, verbKey } from './keys.ts'
import type { VocabData } from './schema.ts'

/** What to do when an incoming entry has the same key as an existing one but different content. */
export type ConflictPolicy = 'keep-existing' | 'overwrite'

export interface SectionReport {
  /** Keys of entries that did not exist yet. */
  added: string[]
  /** Keys of entries that already exist with identical content. */
  unchanged: string[]
  /** Keys of entries that already exist with different content. */
  conflicting: string[]
}

export interface MergeReport {
  nouns: SectionReport
  verbs: SectionReport
  modals: SectionReport
}

export interface MergeResult {
  data: VocabData
  report: MergeReport
}

function mergeSection<T>(
  existing: readonly T[],
  incoming: readonly T[],
  keyOf: (item: T) => string,
  policy: ConflictPolicy
): { items: T[]; report: SectionReport } {
  const items = new Map<string, T>(existing.map((item) => [keyOf(item), item]))
  const report: SectionReport = { added: [], unchanged: [], conflicting: [] }

  for (const item of incoming) {
    const key = keyOf(item)
    const current = items.get(key)

    if (current === undefined) {
      items.set(key, item)
      report.added.push(key)
    } else if (JSON.stringify(current) === JSON.stringify(item)) {
      report.unchanged.push(key)
    } else {
      report.conflicting.push(key)
      if (policy === 'overwrite') items.set(key, item)
    }
  }

  return { items: [...items.values()], report }
}

/**
 * Pure merge of an uploaded file into the current dataset.
 * Nothing is mutated, so the same call can power a "preview" before the user confirms.
 */
export function mergeVocab(
  existing: VocabData,
  incoming: VocabData,
  policy: ConflictPolicy = 'keep-existing'
): MergeResult {
  const nouns = mergeSection(existing.nouns, incoming.nouns, nounKey, policy)
  const verbs = mergeSection(existing.verbs, incoming.verbs, verbKey, policy)
  const modals = mergeSection(existing.modals, incoming.modals, modalKey, policy)

  return {
    data: { version: 1, nouns: nouns.items, verbs: verbs.items, modals: modals.items },
    report: { nouns: nouns.report, verbs: verbs.report, modals: modals.report }
  }
}
