<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import BaseChoice from '@/components/BaseChoice.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Auxiliary, GrammarCase, VerbTag } from '@/domain/vocab'
import {
  ArticleHero,
  ModalTable,
  NounList,
  VerbList,
  useVocabStore,
  useVocabView
} from '@/features/vocab'

type TabKey = 'nouns' | 'verbs' | 'modals'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'nouns', label: 'Nouns' },
  { key: 'verbs', label: 'Verbs' },
  { key: 'modals', label: 'Modal verbs' }
]

const caseOptions: { value: GrammarCase | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Akk', label: 'Akk' },
  { value: 'Dat', label: 'Dat' },
  { value: 'Gen', label: 'Gen' }
]
const takesOptions = caseOptions.filter((option) => option.value !== 'Gen')
const auxiliaryOptions: { value: Auxiliary | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'haben', label: 'haben' },
  { value: 'sein', label: 'sein' }
]
const tagOptions: { value: VerbTag | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'irregular', label: 'irregular' },
  { value: 'separable', label: 'separable' },
  { value: 'reflexive', label: 'reflexive' }
]

const route = useRoute()
const store = useVocabStore()
const {
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
} = useVocabView()

onMounted(() => {
  void store.load()
})

const tab = computed<TabKey>(() => {
  const param = route.params.tab
  return param === 'verbs' || param === 'modals' ? param : 'nouns'
})

const totals = computed(() => ({
  nouns: store.nouns.length,
  verbs: store.verbs.length,
  modals: store.modals.length
}))

const shown = computed(() => ({
  nouns: nouns.value.length,
  verbs: verbs.value.length,
  modals: modals.value.length
}))

const summary = computed(() => {
  const label = tabs.find((item) => item.key === tab.value)?.label.toLowerCase() ?? ''
  return `Showing ${shown.value[tab.value]} of ${totals.value[tab.value]} ${label}`
})
</script>

<template>
  <main class="mx-auto max-w-[1100px] px-4 pb-24 sm:px-6">
    <div class="bg-paper/90 sticky top-0 z-10 -mx-4 px-4 pt-2 pb-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <nav aria-label="Word types" class="border-line flex gap-1 border-b">
          <RouterLink
            v-for="item in tabs"
            :key="item.key"
            :to="`/${item.key}`"
            class="-mb-px border-b-2 px-3 py-2 text-base"
            :class="
              tab === item.key
                ? 'border-ink font-semibold'
                : 'text-muted hover:text-ink border-transparent'
            "
            :aria-current="tab === item.key ? 'page' : undefined"
          >
            {{ item.label }}
            <span class="text-muted ml-1 text-sm">{{ totals[item.key] }}</span>
          </RouterLink>
        </nav>
        <div class="min-w-[12rem] flex-1 sm:max-w-xs">
          <label for="search" class="sr-only">Search words, meanings and examples</label>
          <input
            id="search"
            v-model="query"
            type="search"
            placeholder="Search words, meanings, examples"
            class="border-line bg-surface text-ink placeholder:text-muted w-full rounded-full border px-4 py-2"
          />
        </div>
      </div>
    </div>

    <div v-if="store.status === 'error'" class="mt-6">
      <EmptyState
        title="The vocabulary could not be loaded"
        :hint="store.error ?? 'Please try again.'"
        action-label="Try again"
        @action="store.retry()"
      />
    </div>

    <div v-else-if="store.status !== 'ready'" class="mt-6 space-y-2" aria-busy="true">
      <div
        v-for="row in 6"
        :key="row"
        class="bg-line/60 h-14 rounded-lg motion-safe:animate-pulse"
      />
    </div>

    <div v-else class="mt-5 space-y-5">
      <ArticleHero v-if="tab === 'nouns'" v-model="article" :counts="articleCounts" />
      <div v-if="tab === 'nouns'">
        <BaseChoice v-model="nounCase" label="Case in example" :options="caseOptions" />
      </div>
      <div v-else-if="tab === 'verbs'" class="flex flex-wrap gap-x-6 gap-y-3">
        <BaseChoice v-model="auxiliary" label="Perfekt with" :options="auxiliaryOptions" />
        <BaseChoice v-model="tag" label="Type" :options="tagOptions" />
        <BaseChoice v-model="takes" label="Takes" :options="takesOptions" />
      </div>

      <p class="text-muted text-sm" aria-live="polite">{{ summary }}</p>

      <template v-if="tab === 'nouns'">
        <NounList v-if="nouns.length > 0" :nouns="nouns" />
        <EmptyState
          v-else
          title="No nouns match"
          hint="Try a different spelling, or clear the filters."
          :action-label="hasActiveFilters ? 'Clear search and filters' : undefined"
          @action="reset"
        />
      </template>

      <template v-else-if="tab === 'verbs'">
        <p v-if="verbs.length > 0" class="text-muted max-w-prose text-sm">
          The Perfekt is the helper verb plus the participle. An amber edge marks verbs that use
          <b class="text-sein">sein</b>, usually movement or a change of state. Präteritum is shown
          for er/sie/es.
        </p>
        <VerbList v-if="verbs.length > 0" :verbs="verbs" />
        <EmptyState
          v-else
          title="No verbs match"
          hint="Try a different spelling, or clear the filters."
          :action-label="hasActiveFilters ? 'Clear search and filters' : undefined"
          @action="reset"
        />
      </template>

      <template v-else>
        <ModalTable v-if="modals.length > 0" :modals="modals" />
        <EmptyState
          v-else
          title="No modal verbs match"
          hint="Try a different spelling, or clear the search."
          :action-label="hasActiveFilters ? 'Clear search and filters' : undefined"
          @action="reset"
        />
      </template>
    </div>
  </main>
</template>
