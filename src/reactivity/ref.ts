import { hasChanged, isObject } from '../shared'
import { trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private _rawValue
  public dep
  public __v_isRef = true
  constructor(value) {
    //是对象就 reactive
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackEffect(this.dep)
    return this._value
  }
  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffect(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      let res = Reflect.get(target, key, receiver)
      return unRef(res)
    },
    set(target, key, newValue, receiver) {
      let raw = target[key]
      if (isRef(raw) && !isRef(newValue)) {
        return (raw.value = newValue)
      } else {
        return Reflect.set(target, key, newValue, receiver)
      }
    }
  })
}
