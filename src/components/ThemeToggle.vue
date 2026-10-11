<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue'

import { useTheme } from '@/composables/useTheme'

const { mode, cycle } = useTheme()
const labels = { system: 'System', light: 'Light', dark: 'Dark' } as const
</script>

<template>
  <button
    type="button"
    class="border-line bg-surface text-ink hover:border-ink inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
    :aria-label="`Theme: ${labels[mode]}. Click to change.`"
    @click="cycle"
  >
    <Monitor v-if="mode === 'system'" :size="16" aria-hidden="true" />
    <Sun v-else-if="mode === 'light'" :size="16" aria-hidden="true" />
    <Moon v-else :size="16" aria-hidden="true" />
    {{ labels[mode] }}
  </button>
</template>
