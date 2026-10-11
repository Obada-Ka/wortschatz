<script setup lang="ts">
import { computed } from 'vue'

import type { Article } from '@/domain/vocab'

import { ARTICLE_RULES } from '../constants'

const props = defineProps<{
  modelValue: Article | 'all'
  counts: Record<Article, number>
}>()

const emit = defineEmits<{ 'update:modelValue': [value: Article | 'all'] }>()

const articles: Article[] = ['der', 'die', 'das']

const styles: Record<Article, { idle: string; active: string }> = {
  der: {
    idle: 'text-der hover:bg-der-soft',
    active: 'bg-der-soft text-der border-der'
  },
  die: {
    idle: 'text-die hover:bg-die-soft',
    active: 'bg-die-soft text-die border-die'
  },
  das: {
    idle: 'text-das hover:bg-das-soft',
    active: 'bg-das-soft text-das border-das'
  }
}

const rule = computed(() => (props.modelValue === 'all' ? null : ARTICLE_RULES[props.modelValue]))

function toggle(article: Article): void {
  emit('update:modelValue', props.modelValue === article ? 'all' : article)
}
</script>

<template>
  <section aria-label="Filter nouns by article">
    <div class="grid grid-cols-3 gap-2 sm:gap-3">
      <button
        v-for="article in articles"
        :key="article"
        type="button"
        :aria-pressed="modelValue === article"
        class="bg-surface rounded-xl border-2 px-3 py-3 text-left transition-colors sm:px-5 sm:py-4"
        :class="
          modelValue === article ? styles[article].active : `border-line ${styles[article].idle}`
        "
        @click="toggle(article)"
      >
        <span class="block text-4xl leading-none font-bold tracking-tight sm:text-6xl">
          {{ article }}
        </span>
        <span class="text-ink mt-2 block text-sm">
          {{ counts[article] }} {{ counts[article] === 1 ? 'noun' : 'nouns' }}
        </span>
      </button>
    </div>
    <p class="text-muted mt-3 min-h-12 max-w-prose text-sm" aria-live="polite">
      {{ rule ?? 'Pick an article to see the patterns behind it.' }}
    </p>
  </section>
</template>
