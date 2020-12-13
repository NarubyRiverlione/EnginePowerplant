const Simulator = require('../Simulator')

let simulator
beforeEach(() => {
  simulator = new Simulator()
})

describe('Simulator running tests', () => {
  test('Not running after init', () => {
    expect(simulator.IsRunning).toBeFalsy()
  })
  test('Running after start', () => {
    simulator.Start()
    expect(simulator.IsRunning).toBeTruthy()
  })
  test('Not running after stop', () => {
    simulator.Start()
    simulator.Stop()
    expect(simulator.IsRunning).toBeFalsy()
  })
})
