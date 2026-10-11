<script setup lang="ts" generic="T extends string">
defineProps<{
  label: string
  options: readonly { value: T; label: string }[]
  modelValue: T
}>()

defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2" role="group" :aria-label="label">
    <span class="text-muted mr-1 text-sm">{{ label }}</span>
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="option.value === modelValue"
      class="rounded-full border px-3 py-1 text-sm transition-colors"
      :class="
        option.value === modelValue
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-surface text-ink hover:border-ink'
      "
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
