import { isFunction, isObject } from '../shared'
import { publicInstanceHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    setupState: {}
  }

  return component
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const component = instance.vnode.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers)

  const { setup } = component

  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (isObject(setupResult)) {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}
function finishComponentSetup(instance: any) {
  const component = instance.vnode.type

  if (component.render) {
    instance.render = component.render
  }
}
