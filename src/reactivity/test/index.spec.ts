import { isObject } from '../index'

it('init', () => {
  expect(isObject({})).toBe(true)
})
