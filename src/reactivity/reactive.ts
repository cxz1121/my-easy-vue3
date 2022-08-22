import {
  mutableHandlers,
  ReactiveFlags,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandler'

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObject(target, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}
