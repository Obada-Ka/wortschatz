<script setup lang="ts">
import type { GrammarCase } from '@/domain/vocab'

import { CASE_NAMES } from '../constants'

defineProps<{ value: GrammarCase }>()
</script>

<template>
  <span
    class="border-line text-ink inline-block rounded border px-1.5 py-0.5 text-xs leading-none"
    :title="CASE_NAMES[value]"
  >
    {{ value }}
  </span>
</template>
