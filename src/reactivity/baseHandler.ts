import { track, trigger } from './effect'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter(isReadonly = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]
    const res = Reflect.set(target, key, value, receiver) as any
    if (oldValue !== value) {
      //触发更新
      trigger(target, key)
    }
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  //not set
  set(target, key, value) {
    console.warn(`key: ${key} set fail, target: ${target} is readonly`)
    return true
  }
}
