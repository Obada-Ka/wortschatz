<script setup lang="ts">
defineProps<{ title: string; hint: string; actionLabel?: string }>()
defineEmits<{ action: [] }>()
</script>

<template>
  <div class="border-line rounded-lg border border-dashed px-6 py-12 text-center">
    <p class="text-lg font-semibold">{{ title }}</p>
    <p class="text-muted mt-1">{{ hint }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="border-ink hover:bg-ink hover:text-paper mt-4 rounded-full border px-4 py-1.5 text-sm"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
