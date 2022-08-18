let activeEffect

class ReactiveEffect {
  public deps = []
  constructor(private fn) {}
  run() {
    try {
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = undefined
    }
  }
}

export function effect(fn) {
  // fn
  const _effect = new ReactiveEffect(fn)

  _effect.run()

  const runner = _effect.run.bind(_effect)

  return runner
}

const targetMap = new WeakMap()
export function track(target, key) {
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
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
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
    effect.run()
  })
}
