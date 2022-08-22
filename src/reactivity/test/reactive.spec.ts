import { isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const data = { age: 33 }
    const state = reactive(data)

    expect(state).not.toBe(data)
    expect(state.age).toBe(33)
    expect(isReactive(state)).toBe(true)
    expect(isReactive(data)).toBe(false)
  })

  it('nested reactive', () => {
    const data = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const state = reactive(data)
    expect(isReactive(state.nested)).toBe(true)
    expect(isReactive(state.array)).toBe(true)
    expect(isReactive(state.array[0])).toBe(true)
  })
})
