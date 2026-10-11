import { ref, watchEffect } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'wortschatz:theme'
const ORDER: ThemeMode[] = ['system', 'light', 'dark']

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage can be unavailable (private mode); fall back to the system theme.
  }
  return 'system'
}

const mode = ref<ThemeMode>(readStoredMode())

watchEffect(() => {
  const root = document.documentElement
  if (mode.value === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode.value)
  try {
    localStorage.setItem(STORAGE_KEY, mode.value)
  } catch {
    // ignore
  }
})

export function useTheme(): { mode: typeof mode; cycle: () => void } {
  function cycle(): void {
    const next = ORDER[(ORDER.indexOf(mode.value) + 1) % ORDER.length]
    mode.value = next ?? 'system'
  }
  return { mode, cycle }
}
