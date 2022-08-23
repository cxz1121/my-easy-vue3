const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}

export const publicInstanceHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }
    if (key in publicPropertiesMap) {
      return publicPropertiesMap[key](instance)
    }
  }
}
