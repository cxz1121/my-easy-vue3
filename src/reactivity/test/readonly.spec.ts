import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const data = { age: 33, info: { name: 'cxz' } }
    //readonly   can not set
    const readonlyData = readonly(data)
    expect(readonlyData).not.toBe(data)
    expect(readonlyData.age).toBe(33)
  })

  it('warn when set', () => {
    const state = readonly({ age: 33 })
    //jest.fn()
    console.warn = jest.fn()
    state.age++

    expect(console.warn).toBeCalled()
  })
})
