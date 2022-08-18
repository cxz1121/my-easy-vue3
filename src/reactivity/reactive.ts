import { mutableHandlers, ReactiveFlags, readonlyHandlers } from './baseHandler'

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}
