const Valve = require('../Components/Valve')

let valve
beforeEach(() => {
  valve = new Valve()
})

describe('Valve init', () => {
  test('Valve starts open, without output', () => {
    expect(valve.IsOpen).toBeTruthy()
    expect(valve.Output()).toBe(0)
  })
  test('Valve with input starts open, without output', () => {
    const valveWithInput = new Valve(123)
    expect(valveWithInput.IsOpen).toBeTruthy()
    expect(valveWithInput.Output()).toBe(0)
  })
})

describe('Valve close', () => {
  test('Closed valve has output', () => {
    const input = 12345.6
    const testValve = new Valve(input)
    testValve.Close()
    expect(testValve.Output()).toBe(input)
  })
  test('Closed valve has output and delivers feedback', () => {
    const input = 458
    const answer = 'test feedback closing valve'
    let cbFlag = false
    const cbClosing = (feedback) => {
      // console.debug('closing cb')
      expect(feedback).toBe(answer)
      cbFlag = true
    }

    const testValve = new Valve(input, null, cbClosing(answer))

    testValve.Close()
    expect(testValve.Output()).toBe(input)
    expect(cbFlag).toBeTruthy()
  })
})

describe('Valve open after closed', () => {
  test('Open en previous closed valve has no output', () => {
    const input = 7892
    const testValve = new Valve(input)
    testValve.Close()
    testValve.Open()
    expect(valve.Output()).toBe(0)
  })
  test('Open en previous closed valve has no output and provides feedbacl', () => {
    const input = 7892
    let cbFlag = false
    const answer = 'test feedback opening valve'
    const cbOpening = (feedback) => {
      // console.debug('opening cb')
      expect(feedback).toBe(answer)
      cbFlag = true
    }

    const testValve = new Valve(input, cbOpening(answer))
    testValve.Close()
    testValve.Open()
    expect(valve.Output()).toBe(0)
    expect(cbFlag).toBeTruthy()
  })
})
