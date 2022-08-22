import { extend } from '../shared'

let activeEffect

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

class ReactiveEffect {
  public deps = []
  public active = true
  public parent = null
  onStop?: () => void
  constructor(private fn, public scheduler?) {}
  run() {
    if (!this.active) {
      return this.fn()
    }
    try {
      cleanupEffect(this)
      this.parent = activeEffect
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }
  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
    }
    // this.deps.forEach((dep: any) => {
    //   dep.delete(this)
    // })
  }
}

export function effect(fn, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // _effect.onStop = options.onStop
  // Object.assign(_effect, options)
  //extend
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}

const targetMap = new WeakMap()
export function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  trackEffect(dep)
}

export function trackEffect(dep) {
  if (activeEffect) {
    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
      dep.add(activeEffect)
      activeEffect.deps.push(dep)
    }
  }
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let effects = depsMap.get(key)
  if (effects) {
    triggerEffect(effects)
  }
}

export function triggerEffect(effects) {
  effects = new Set(effects)
  effects.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}
