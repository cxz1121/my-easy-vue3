export const extend = Object.assign

export function isObject(value) {
  return typeof value === 'object' && value !== null
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue)
}
