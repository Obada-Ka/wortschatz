<script setup lang="ts">
import { verbKey } from '@/domain/vocab'
import type { Verb, VerbObject } from '@/domain/vocab'

import CaseChip from './CaseChip.vue'

defineProps<{ verbs: readonly Verb[] }>()

function governs(object: VerbObject): string {
  return object.prepositions.length > 0 ? `${object.prepositions.join(' / ')} +` : ''
}
</script>

<template>
  <div class="border-line bg-surface overflow-hidden rounded-lg border">
    <div
      class="border-line text-muted hidden grid-cols-[minmax(10rem,1.1fr)_minmax(7rem,0.9fr)_minmax(9rem,1.2fr)_minmax(8rem,1fr)_minmax(11rem,1.2fr)_minmax(5rem,0.6fr)] gap-x-4 border-b px-5 py-2 text-xs lg:grid"
      aria-hidden="true"
    >
      <span>Infinitive</span>
      <span>Meaning</span>
      <span>Präsens (ich / er)</span>
      <span>Präteritum (er)</span>
      <span>Perfekt</span>
      <span>Takes</span>
    </div>
    <ul class="divide-line divide-y">
      <li
        v-for="verb in verbs"
        :key="verbKey(verb)"
        class="border-l-4 px-4 py-3"
        :class="verb.auxiliary === 'sein' ? 'border-l-sein' : 'border-l-transparent'"
      >
        <div
          class="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-[minmax(10rem,1.1fr)_minmax(7rem,0.9fr)_minmax(9rem,1.2fr)_minmax(8rem,1fr)_minmax(11rem,1.2fr)_minmax(5rem,0.6fr)] lg:items-baseline"
        >
          <div class="col-span-2 lg:col-span-1">
            <p class="text-xl leading-tight font-semibold">{{ verb.infinitive }}</p>
            <p v-if="verb.tags.length > 0" class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="tag in verb.tags"
                :key="tag"
                class="border-line text-muted rounded border px-1.5 py-0.5 text-xs leading-none"
              >
                {{ tag }}
              </span>
            </p>
          </div>
          <div class="col-span-2 lg:col-span-1">
            <span class="field-label">Meaning</span>
            {{ verb.meaning }}
          </div>
          <div class="col-span-2 lg:col-span-1">
            <span class="field-label">Präsens (ich / er)</span>
            {{ verb.present.ich }} / {{ verb.present.er }}
          </div>
          <div>
            <span class="field-label">Präteritum (er)</span>
            {{ verb.preterite }}
          </div>
          <div>
            <span class="field-label">Perfekt</span>
            <span
              class="mr-1 rounded px-1.5 py-0.5 text-xs"
              :class="verb.auxiliary === 'sein' ? 'bg-sein-soft text-sein' : 'bg-paper text-muted'"
            >
              {{ verb.auxiliary }}
            </span>
            {{ verb.participle }}
          </div>
          <div class="col-span-2 flex flex-wrap items-center gap-1 lg:col-span-1">
            <span class="field-label w-full">Takes</span>
            <span v-if="verb.takes.length === 0" class="text-muted">–</span>
            <span v-for="object in verb.takes" :key="governs(object) + object.case" class="text-sm">
              {{ governs(object) }} <CaseChip :value="object.case" />
            </span>
          </div>
        </div>
        <p class="example mt-2">{{ verb.example }}</p>
      </li>
    </ul>
  </div>
</template>
