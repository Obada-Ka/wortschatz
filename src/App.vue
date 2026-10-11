<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <header
    class="mx-auto flex max-w-[1100px] items-end justify-between gap-4 px-4 pt-8 pb-5 sm:px-6"
  >
    <div>
      <h1 class="text-4xl leading-none font-bold tracking-tight sm:text-5xl">Wortschatz</h1>
      <p class="text-muted mt-2">My German vocabulary</p>
    </div>
    <ThemeToggle />
  </header>
  <RouterView />
</template>
