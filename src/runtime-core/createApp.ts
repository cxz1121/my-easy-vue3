import { render } from './renderer'
import { createVnode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      //component to vnode
      const vnode = createVnode(rootComponent)

      const container = document.querySelector(rootContainer)
      render(vnode, container)
    }
  }
}
