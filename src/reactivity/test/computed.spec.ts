import { computed } from '../computed'
import { effect } from '../effect'
import { reactive } from '../reactive'
import { ref } from '../ref'

describe('computed', () => {
  it('happy path', () => {
    //缓存
    //ref
    //.value
    const state = reactive({
      firstName: 'cxz',
      LastName: 'ccc'
    })
    const fullName = computed(() => {
      return state.firstName + state.LastName
    })

    expect(fullName.value).toBe('cxzccc')
  })
  it('should compute lazy', () => {
    const trackOuterEffectComputedData = reactive({ age: 33 })
    const trackOuterEffectComputed = computed(
      () => trackOuterEffectComputedData.age
    )
    //computed 本身是个effect 也要收集外层的effect
    let nextAge
    effect(() => {
      nextAge = trackOuterEffectComputed.value
    })
    expect(nextAge).toBe(33)
    trackOuterEffectComputedData.age++
    expect(nextAge).toBe(34)

    const state = reactive({ age: 33 })
    const getter = jest.fn(() => state.age)
    const computedState = computed(getter)
    //lazy
    expect(getter).not.toHaveBeenCalled()
    expect(computedState.value).toBe(33)
    expect(getter).toHaveBeenCalledTimes(1)

    //should not compute again
    computedState.value
    expect(getter).toHaveBeenCalledTimes(1)

    //should not compute until needed
    state.age = 66
    expect(getter).toHaveBeenCalledTimes(1)

    //now should compute
    expect(computedState.value).toBe(66)
    expect(getter).toHaveBeenCalledTimes(2)

    //should not compute again
    computedState.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
