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

  it('scheduler', () => {
    //1. 第二个参数 options 是个对象 里面有scheduler
    //2. 执行 effect 首次执行 fn
    //3. 之后触发响应式更新时 fn不执行 scheduler执行
    //4. effect 执行返回的 runner 执行时 执行fn
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        scheduler
      }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    //should be caled on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    //should not run yet
    expect(dummy).toBe(1)
    //manually run
    run()
    //should have run
    expect(dummy).toBe(2)
  })
})
