import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Modal, Noun, Verb } from '@/domain/vocab'
import { loadVocab } from '@/lib/loadVocab'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export const useVocabStore = defineStore('vocab', () => {
  const nouns = ref<Noun[]>([])
  const verbs = ref<Verb[]>([])
  const modals = ref<Modal[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    if (status.value === 'loading' || status.value === 'ready') return
    status.value = 'loading'
    error.value = null
    try {
      const data = await loadVocab()
      nouns.value = data.nouns
      verbs.value = data.verbs
      modals.value = data.modals
      status.value = 'ready'
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unknown error'
      status.value = 'error'
    }
  }

  async function retry(): Promise<void> {
    status.value = 'idle'
    await load()
  }

  return { nouns, verbs, modals, status, error, load, retry }
})
