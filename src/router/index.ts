import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import VocabPage from '@/pages/VocabPage.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/nouns' },
  { path: '/:tab(nouns|verbs|modals)', name: 'vocab', component: VocabPage },
  { path: '/:pathMatch(.*)*', redirect: '/nouns' }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
