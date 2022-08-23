import { h } from '../../lib/easy-vue3.esm.js'

window.self = null
export const App = {
  //.vue
  //template
  //render

  render() {
    window.self = this
    return h('div', { id: 111, class: 'foo' }, 'hello ' + this.name)
    // return h('div', { id: 111, class: 'foo' }, [
    //   h('p', { class: 'p', style: { color: 'red' } }, 'is p'),
    //   h('h1', { class: 'h1' }, 'is h1')
    // ])
  },
  setup() {
    //composition api

    return {
      name: 'cxz'
    }
  }
}
