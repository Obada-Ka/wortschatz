// Lets plain TypeScript tooling (ESLint's type-aware rules) resolve `.vue` imports.
// vue-tsc itself understands single-file components natively.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}
