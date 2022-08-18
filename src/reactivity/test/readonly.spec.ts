import { isReadonly, reactive, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const data = { age: 33, info: { name: 'cxz' } }
    //readonly   can not set
    const readonlyData = readonly(data)
    const reactiveData = reactive(data)
    expect(readonlyData).not.toBe(data)
    expect(readonlyData.age).toBe(33)
    expect(isReadonly(readonlyData)).toBe(true)
    expect(isReadonly(reactiveData)).toBe(false)
    expect(isReadonly(data)).toBe(false)
  })

  it('warn when set', () => {
    const state = readonly({ age: 33 })
    //jest.fn()
    console.warn = jest.fn()
    state.age++

    expect(console.warn).toBeCalled()
  })
})
