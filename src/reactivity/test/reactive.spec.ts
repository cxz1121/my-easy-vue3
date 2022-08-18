import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const data = { age: 33 }
    const state = reactive(data)

    expect(state).not.toBe(data)
    expect(state.age).toBe(33)
  })
})
