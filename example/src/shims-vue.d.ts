
declare module '*.vue' {
  import { Component } from 'vue'
  const component: Component
  export default component
}

declare module 'globby!/*.@(svg)' {
  const icons: Record<string, string>
  export default icons
}

