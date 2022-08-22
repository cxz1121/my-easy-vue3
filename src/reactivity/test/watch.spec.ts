import { reactive } from '../reactive'
import { watch } from '../watch'

describe('watch', () => {
  it('happy path', () => {
    const state = reactive({
      age: 33
    })
    let cb = jest.fn((oldValue, newValue) => {
      //watch(() => state.age, cb) 33 34
      console.log(oldValue, newValue)
    })
    // watch(state, cb) { age: 34 } { age: 34 } 对象指向同一个引用

    watch(() => state.age, cb)

    expect(cb).not.toHaveBeenCalled()
    state.age++
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
