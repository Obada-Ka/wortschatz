import seed from '@/data/vocab.seed.json'
import { vocabFileSchema } from '@/domain/vocab'
import type { VocabData } from '@/domain/vocab'

/**
 * The single place the app gets its vocabulary from. Today that is the bundled
 * seed file; swapping in a remote source later only changes this function.
 * Whatever comes back is validated, so bad data fails loudly here instead of
 * rendering broken rows.
 */
export function loadVocab(): Promise<VocabData> {
  return Promise.resolve(vocabFileSchema.parse(seed))
}
