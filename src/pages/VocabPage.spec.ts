import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@/App.vue'
import { routes } from '@/router'

async function mountAt(path: string) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [pinia, router] }, attachTo: document.body })
  await flushPromises()
  return { wrapper, router }
}

describe('VocabPage', () => {
  it('redirects the root to the nouns tab and lists every noun', async () => {
    const { wrapper, router } = await mountAt('/')
    expect(router.currentRoute.value.path).toBe('/nouns')
    expect(wrapper.text()).toContain('Showing 97 of 97 nouns')
    wrapper.unmount()
  })

  it('filters nouns by article when a big article button is pressed', async () => {
    const { wrapper } = await mountAt('/nouns')
    const buttons = wrapper.findAll('button[aria-pressed]')
    const der = buttons.find((button) => button.text().startsWith('der'))
    expect(der).toBeDefined()
    await der?.trigger('click')
    expect(wrapper.text()).toMatch(/Showing \d+ of 97 nouns/)
    expect(wrapper.text()).not.toContain('Showing 97 of 97')
    expect(wrapper.text()).toContain('Masculine')
    wrapper.unmount()
  })

  it('finds words regardless of umlauts and shows an empty state with a way out', async () => {
    const { wrapper } = await mountAt('/nouns')
    const input = wrapper.get('input[type="search"]')

    await input.setValue('prufung')
    expect(wrapper.text()).toContain('Prüfung')

    await input.setValue('zzzz')
    expect(wrapper.text()).toContain('No nouns match')
    const clear = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Clear search and filters')
    expect(clear).toBeDefined()
    await clear?.trigger('click')
    expect(wrapper.text()).toContain('Showing 97 of 97 nouns')
    wrapper.unmount()
  })

  it('renders verbs and filters them by auxiliary', async () => {
    const { wrapper } = await mountAt('/verbs')
    expect(wrapper.text()).toContain('Showing 88 of 88 verbs')
    const sein = wrapper.findAll('button[aria-pressed]').find((button) => button.text() === 'sein')
    await sein?.trigger('click')
    expect(wrapper.text()).not.toContain('Showing 88 of 88')
    expect(wrapper.text()).toContain('fliegen')
    wrapper.unmount()
  })

  it('renders the modal verb table', async () => {
    const { wrapper } = await mountAt('/modals')
    expect(wrapper.findAll('tbody tr')).toHaveLength(7)
    wrapper.unmount()
  })
})
