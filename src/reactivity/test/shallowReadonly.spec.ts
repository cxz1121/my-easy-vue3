import { isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const state = shallowReadonly({ outer: { inner: 1 } })
    expect(isReadonly(state)).toBe(true)
    expect(isReadonly(state.outer)).toBe(false)
  })
  it('warn when set', () => {
    const state = shallowReadonly({ age: 33 })
    //jest.fn()
    console.warn = jest.fn()
    state.age++

    expect(console.warn).toBeCalled()
  })
})
