import { track, trigger } from './effect'

export function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)

      //TODO 依赖收集
      track(target, key)
      return res
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const res = Reflect.set(target, key, value, receiver) as any
      if (oldValue !== value) {
        //TODO 触发更新
        trigger(target, key)
        return res
      }
      return res
    }
  })

  return proxy
}

export function readonly(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return res
    },
    //not set
    set() {
      console.warn('readonly')
      return true
    }
  })
  return proxy
}
