import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import type { Article, Auxiliary, GrammarCase, Modal, Noun, Verb, VerbTag } from '@/domain/vocab'
import { compareGerman, foldText } from '@/utils/text'

import { useVocabStore } from '../store/vocabStore'

type Any<T extends string> = T | 'all'

export interface VocabView {
  query: Ref<string>
  article: Ref<Any<Article>>
  nounCase: Ref<Any<GrammarCase>>
  auxiliary: Ref<Any<Auxiliary>>
  tag: Ref<Any<VerbTag>>
  takes: Ref<Any<GrammarCase>>
  nouns: ComputedRef<Noun[]>
  verbs: ComputedRef<Verb[]>
  modals: ComputedRef<Modal[]>
  articleCounts: ComputedRef<Record<Article, number>>
  hasActiveFilters: ComputedRef<boolean>
  reset: () => void
}

const matches = (needle: string, ...fields: string[]): boolean =>
  needle === '' || fields.some((field) => foldText(field).includes(needle))

export function useVocabView(): VocabView {
  const store = useVocabStore()

  const query = ref('')
  const article = ref<Any<Article>>('all')
  const nounCase = ref<Any<GrammarCase>>('all')
  const auxiliary = ref<Any<Auxiliary>>('all')
  const tag = ref<Any<VerbTag>>('all')
  const takes = ref<Any<GrammarCase>>('all')

  const needle = computed(() => foldText(query.value))

  // Everything except the article filter, so the big der/die/das counts stay meaningful.
  const nounsBeforeArticle = computed(() =>
    store.nouns.filter(
      (noun) =>
        (nounCase.value === 'all' || noun.case === nounCase.value) &&
        matches(needle.value, noun.word, noun.plural ?? '', noun.meaning, noun.example)
    )
  )

  const nouns = computed(() =>
    nounsBeforeArticle.value
      .filter((noun) => article.value === 'all' || noun.article === article.value)
      .sort((a, b) => compareGerman(a.word, b.word))
  )

  const articleCounts = computed(() => {
    const counts: Record<Article, number> = { der: 0, die: 0, das: 0 }
    for (const noun of nounsBeforeArticle.value) counts[noun.article] += 1
    return counts
  })

  const verbs = computed(() =>
    store.verbs
      .filter(
        (verb) =>
          (auxiliary.value === 'all' || verb.auxiliary === auxiliary.value) &&
          (tag.value === 'all' || verb.tags.includes(tag.value)) &&
          (takes.value === 'all' || verb.takes.some((object) => object.case === takes.value)) &&
          matches(
            needle.value,
            verb.infinitive,
            verb.meaning,
            verb.participle,
            verb.preterite,
            verb.example
          )
      )
      .sort((a, b) =>
        compareGerman(a.infinitive.replace('sich ', ''), b.infinitive.replace('sich ', ''))
      )
  )

  const modals = computed(() =>
    store.modals.filter((modal) =>
      matches(needle.value, modal.infinitive, modal.meaning, ...modal.examples)
    )
  )

  const hasActiveFilters = computed(
    () =>
      query.value !== '' ||
      article.value !== 'all' ||
      nounCase.value !== 'all' ||
      auxiliary.value !== 'all' ||
      tag.value !== 'all' ||
      takes.value !== 'all'
  )

  function reset(): void {
    query.value = ''
    article.value = 'all'
    nounCase.value = 'all'
    auxiliary.value = 'all'
    tag.value = 'all'
    takes.value = 'all'
  }

  return {
    query,
    article,
    nounCase,
    auxiliary,
    tag,
    takes,
    nouns,
    verbs,
    modals,
    articleCounts,
    hasActiveFilters,
    reset
  }
}
