const Tank = require('../Components/Tank')
// const { CstBoundaries } = require('../Cst')

describe('Tank init', () => {
  test('New empty tank', () => {
    const tank = new Tank(250)
    expect(tank.MaxContent).toBe(250)
    expect(tank.Content()).toBe(0)
  })
  test('New tank with content', () => {
    const tank = new Tank(250, 100)
    expect(tank.MaxContent).toBe(250)
    expect(tank.Content()).toBe(100)
  })
})

describe('Tank add 1 step', () => {
  test('Add 1 step to empty tank', () => {
    const tank = new Tank(250)
    tank.AddEachStep = 100
    tank.Add()
    expect(tank.Content()).toBe(100)
  })
  test('Add 1 step to not empty tank', () => {
    const tank = new Tank(250, 200)
    tank.AddEachStep = 20
    tank.Add()
    expect(tank.Content()).toBe(220)
  })
  test('Try overfill tank', () => {
    let cbFullFlag = false
    const cbFull = () => { cbFullFlag = true }
    const tank = new Tank(100, 80)
    tank.CbFull = cbFull
    tank.AddEachStep = 40
    tank.Add()
    expect(tank.Content()).toBe(100)
    expect(cbFullFlag).toBeTruthy()
  })
})

describe('Tank remove 1 step', () => {
  test('Remove from not empty tank', () => {
    const tank = new Tank(200, 150)
    tank.RemoveEachStep = 45
    tank.Remove()
    expect(tank.Content()).toBe(105)
  })
  test('Remove from empty tank = empty (not negative content)', () => {
    const tank = new Tank(200, 0)
    tank.RemoveEachStep = 45
    tank.Remove()
    expect(tank.Content()).toBe(0)
  })
  test('Remove from more then content from tank = empty (not negative content)', () => {
    const tank = new Tank(150, 80)
    tank.RemoveEachStep = 100
    tank.Remove()
    expect(tank.Content()).toBe(0)
  })
})

describe('Tank add over time', () => {
  test('Add in 4 steps of each 10', done => {
    jest.setTimeout = 10000
    const startContent = 20
    const addEachStep = 10
    const amountOfSteps = 4
    let step = 0

    const tank = new Tank(100, startContent)
    tank.AddEachStep = addEachStep

    const cb = () => {
      step += 1
      // console.debug(`Step ${step}: content = ${tank.Content()}`)

      const newContent = startContent + step * addEachStep
      expect(tank.Content()).toBe(newContent)
      if (step === amountOfSteps) {
        // console.debug('stop adding')
        tank.StopAdding()
        expect(tank.Content()).toBe(startContent + amountOfSteps * addEachStep)
        done()
      }
    }
    tank.StartAdding(cb)
  })
  test('Start filling until full', done => {
    jest.setTimeout = 10000
    const startContent = 80
    const addEachStep = 10
    const amountOfSteps = 4
    const maxTank = 100
    let step = 0
    let cbFullFlag = false
    const cbFull = () => { cbFullFlag = true }

    const tank = new Tank(maxTank, startContent)
    tank.AddEachStep = addEachStep
    tank.CbFull = cbFull

    const cb = () => {
      step += 1
      if (step === amountOfSteps) {
        // console.debug('stop adding test')
        tank.StopAdding()
        expect(tank.Content()).toBe(maxTank)
        expect(cbFullFlag).toBeTruthy()
        done()
      }
      // console.debug(`Step ${step}: content = ${tank.Content()}`)
      if ((step * addEachStep) > (maxTank - startContent)) {
        // console.debug('Should stop adding because tank is full')
        expect(tank.Content()).toBe(maxTank)
      } else {
        const newContent = startContent + step * addEachStep
        expect(tank.Content()).toBe(newContent)
      }
    }
    tank.StartAdding(cb)
  })
})

describe('Tank remove over time', () => {
  test('Remove in 4 steps of each 10', done => {
    jest.setTimeout = 1000
    const startContent = 80
    const removeEachStep = 10
    const amountOfSteps = 4
    let step = 0

    const tank = new Tank(100, startContent)
    tank.RemoveEachStep = removeEachStep

    const cb = () => {
      step += 1
      // console.debug(`Step ${step}: content = ${tank.Content}`)

      const newContent = startContent - step * removeEachStep
      expect(tank.Content()).toBe(newContent)
      if (step === amountOfSteps) {
        // console.debug('empty tank - stop removing')
        tank.StopAdding()
        expect(tank.Content()).toBe(startContent - amountOfSteps * removeEachStep)
        done()
      }
    }
    tank.StartRemoving(cb)
  })
  test('Remove in until empty ', done => {
    jest.setTimeout = 10000
    const startContent = 20
    const removeEachStep = 10
    const amountOfSteps = 4
    let step = 0

    const tank = new Tank(100, startContent)
    tank.RemoveEachStep = removeEachStep

    const cb = () => {
      step += 1
      // console.debug(`Step ${step}: content = ${tank.Content}`)
      if (step * removeEachStep < startContent) {
        const newContent = startContent - step * removeEachStep
        expect(tank.Content()).toBe(newContent)
      } else {
        expect(tank.Content()).toBe(0)
      }
      if (step === amountOfSteps) {
        // console.debug('empty tank - stop removing')
        tank.StopAdding()
        expect(tank.Content()).toBe(0)
        done()
      }
    }
    tank.StartRemoving(cb)
  })
})
