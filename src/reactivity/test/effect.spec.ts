import { effect } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 33
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(34)

    //update 触发依赖
    user.age++
    expect(nextAge).toBe(35)
  })

  it('should return a runner when call effect', () => {
    let age = 33

    const runner = effect(() => {
      age++
      return 'run'
    })
    expect(age).toBe(34)
    const r = runner()
    expect(age).toBe(35)
    expect(r).toBe('run')
  })
})
