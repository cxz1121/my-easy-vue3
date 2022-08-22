import { isFunction, isObject } from '../shared'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'

function traversal(value, set = new Set()) {
  if (!isObject(value)) return value
  if (set.has(value)) return value
  set.add(value)
  for (let key in value) {
    traversal(value[key], set)
  }
  return value
}

export function watch(source, cb) {
  let getter
  let oldValue

  if (isReactive(source)) {
    getter = () => traversal(source)
  } else if (isFunction(source)) {
    getter = source
  } else {
    return
  }

  let job = () => {
    const newValue = effect.run()
    cb(oldValue, newValue)
    oldValue = newValue
  }

  const effect = new ReactiveEffect(getter, job)

  oldValue = effect.run()
}
