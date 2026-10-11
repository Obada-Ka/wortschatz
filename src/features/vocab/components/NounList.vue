<script setup lang="ts">
import { nounKey } from '@/domain/vocab'
import type { Article, Noun } from '@/domain/vocab'

import CaseChip from './CaseChip.vue'

defineProps<{ nouns: readonly Noun[] }>()

const spine: Record<Article, string> = {
  der: 'border-l-der',
  die: 'border-l-die',
  das: 'border-l-das'
}
const articleColor: Record<Article, string> = { der: 'text-der', die: 'text-die', das: 'text-das' }

function pluralLabel(noun: Noun): string {
  if (noun.pluralOnly) return 'plural only'
  return noun.plural ?? 'no plural'
}
</script>

<template>
  <div class="border-line bg-surface overflow-hidden rounded-lg border">
    <div
      class="border-line text-muted hidden grid-cols-[minmax(16rem,1.4fr)_minmax(10rem,1fr)_4rem_minmax(8rem,1fr)_minmax(14rem,2fr)] gap-x-4 border-b px-5 py-2 text-xs lg:grid"
      aria-hidden="true"
    >
      <span>Word</span>
      <span>Plural</span>
      <span>Case</span>
      <span>Meaning</span>
      <span>Example</span>
    </div>
    <ul class="divide-line divide-y">
      <li
        v-for="noun in nouns"
        :key="nounKey(noun)"
        class="grid grid-cols-2 gap-x-4 gap-y-2 border-l-4 px-4 py-3 lg:grid-cols-[minmax(16rem,1.4fr)_minmax(10rem,1fr)_4rem_minmax(8rem,1fr)_minmax(14rem,2fr)] lg:items-baseline lg:px-4"
        :class="spine[noun.article]"
      >
        <div class="col-span-2 flex items-baseline justify-between gap-3 lg:col-span-1 lg:block">
          <p class="text-xl leading-tight font-semibold">
            <span :class="articleColor[noun.article]">{{ noun.article }}</span>
            {{ noun.word }}
          </p>
          <CaseChip class="lg:hidden" :value="noun.case" />
        </div>
        <div>
          <span class="field-label">Plural</span>
          <span :class="{ 'text-muted': noun.plural === null }">{{ pluralLabel(noun) }}</span>
        </div>
        <div class="hidden lg:block"><CaseChip :value="noun.case" /></div>
        <div>
          <span class="field-label">Meaning</span>
          {{ noun.meaning }}
        </div>
        <p class="example col-span-2 lg:col-span-1">{{ noun.example }}</p>
      </li>
    </ul>
  </div>
</template>
