const Tank = require('../Components/Tank')

describe('Tank init', () => {
  test('New empty tank', () => {
    const tank = new Tank(250)
    expect(tank.MaxContent).toBe(250)
    expect(tank.Content).toBe(0)
  })
  test('New tank with content', () => {
    const tank = new Tank(250, 100)
    expect(tank.MaxContent).toBe(250)
    expect(tank.Content).toBe(100)
  })
})

describe('Tank add', () => {
  test('Add to empty tank', () => {
    const tank = new Tank(250)
    tank.Add(100)
    expect(tank.Content).toBe(100)
  })
  test('Add to not empty tank', () => {
    const tank = new Tank(250, 200)
    tank.Add(20)
    expect(tank.Content).toBe(220)
  })
  test('Try overfill tank', () => {
    const tank = new Tank(100, 80)
    tank.Add(40)
    expect(tank.Content).toBe(100)
  })
  test('Try overfill full tank', () => {
    const tank = new Tank(50, 50)
    tank.Add(1)
    expect(tank.Content).toBe(50)
  })
})

describe('Tank remove', () => {
  test('Remove from not empty tank', () => {
    const tank = new Tank(200, 150)
    tank.Remove(45)
    expect(tank.Content).toBe(105)
  })
  test('Remove from empty tank', () => {
    const tank = new Tank(200, 0)
    tank.Remove(45)
    expect(tank.Content).toBe(0)
  })
  test('Remove from more then content tank', () => {
    const tank = new Tank(150, 80)
    tank.Remove(100)
    expect(tank.Content).toBe(0)
  })
})

describe('Tank add over time', () => {
  test('Add 4 steps of each 10', done => {
    jest.setTimeout = 10000
    const startContent = 20
    const addEachStep = 10
    const amountOfSteps = 4
    let step = 0
    const tank = new Tank(100, startContent)

    const cb = () => {
      step += 1
      // console.debug(`Step ${step}: content = ${tank.Content}`)

      const newContent = startContent + step * addEachStep
      expect(tank.Content).toBe(newContent)
      if (step === amountOfSteps) {
        // console.debug('stop adding')
        tank.StopAdding()
        expect(tank.Content).toBe(startContent + amountOfSteps * addEachStep)
        done()
      }
    }
    tank.StartAdding(addEachStep, cb)
  })

  test('Start filling until full', done => {
    jest.setTimeout = 10000
    const startContent = 80
    const addEachStep = 10
    const amountOfSteps = 4
    let step = 0
    const tank = new Tank(100, startContent)

    const cb = () => {
      step += 1
      // console.debug(`Step ${step}: content = ${tank.Content}`)
      if (tank.Content === tank.MaxContent) {
        console.debug('Stop adding because tank is full')
        expect(tank.Adding).toBeNull() // adding interval stopped because overfill
        done()
      }
      const newContent = startContent + step * addEachStep
      expect(tank.Content).toBe(newContent)
      if (step === amountOfSteps) {
        // console.debug('stop adding')
        tank.StopAdding()
        expect(tank.Content).toBe(startContent + amountOfSteps * addEachStep)
        done()
      }
    }
    tank.StartAdding(addEachStep, cb)
  })
})
