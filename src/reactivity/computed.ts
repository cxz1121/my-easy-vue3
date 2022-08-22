import { ReactiveEffect, trackEffect, triggerEffect } from './effect'

class computedRefImpl {
  private _getter: any
  private _value: any
  private _dirty: boolean = true
  private _effect: any
  private dep = new Set()
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffect(this.dep)
      }
    })
  }
  get value() {
    if (this._dirty) {
      this._dirty = false
      trackEffect(this.dep)
      this._value = this._effect.run()
    }

    return this._value
  }
}

export function computed(getter) {
  return new computedRefImpl(getter)
}
