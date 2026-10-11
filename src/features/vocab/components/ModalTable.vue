<script setup lang="ts">
import { modalKey, PERSONS } from '@/domain/vocab'
import type { Modal } from '@/domain/vocab'

defineProps<{ modals: readonly Modal[] }>()
</script>

<template>
  <div class="space-y-6">
    <p class="text-muted max-w-prose">
      The modal verb takes position 2, the other verb goes to the end as an infinitive:
      <span class="example text-ink">Ich <b>kann</b> Deutsch <b>sprechen</b>.</span>
    </p>

    <div class="border-line bg-surface overflow-x-auto rounded-lg border">
      <table class="w-full min-w-[44rem] border-collapse text-left">
        <thead>
          <tr class="border-line text-muted border-b text-xs">
            <th class="px-4 py-2 font-normal">Verb</th>
            <th v-for="person in PERSONS" :key="person" class="px-3 py-2 font-normal">
              {{ person }}
            </th>
            <th class="px-3 py-2 font-normal">Präteritum (ich / er)</th>
            <th class="px-3 py-2 font-normal">Perfekt</th>
          </tr>
        </thead>
        <tbody class="divide-line divide-y">
          <tr v-for="modal in modals" :key="modalKey(modal)">
            <th scope="row" class="px-4 py-3 align-top">
              <span class="block text-lg font-semibold">{{ modal.infinitive }}</span>
              <span class="text-muted text-sm font-normal">{{ modal.meaning }}</span>
            </th>
            <td v-for="(form, index) in modal.present" :key="index" class="px-3 py-3 align-top">
              {{ form }}
            </td>
            <td class="px-3 py-3 align-top">{{ modal.preterite }}</td>
            <td class="px-3 py-3 align-top">{{ modal.perfekt }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="space-y-3">
      <details
        v-for="modal in modals"
        :key="modalKey(modal)"
        class="border-line bg-surface rounded-lg border px-4 py-3"
      >
        <summary class="cursor-pointer text-lg font-semibold">
          {{ modal.infinitive }}
          <span class="text-muted text-sm font-normal">examples</span>
        </summary>
        <ul class="mt-3 space-y-2">
          <li
            v-for="(example, index) in modal.examples"
            :key="index"
            class="grid gap-x-4 sm:grid-cols-[7rem_1fr]"
          >
            <span class="text-muted text-sm">{{ PERSONS[index] }}</span>
            <span class="example">{{ example }}</span>
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>
