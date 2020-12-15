const FuelSystem = require('../FuelSystem')
const { CstFuelSys, CstTxt } = require('../Cst')
const { FuelSysTxt } = CstTxt

let fuelSys
beforeEach(() => {
  fuelSys = new FuelSystem()
})

describe('Fuel system init', () => {
  test('Empty diesel tank', () => {
    expect(fuelSys.DieselTank.Content).toBe(0)
    expect(fuelSys.DieselTank.MaxContent).toBe(CstFuelSys.DsStorageTank.TankVolume)
  })
  test('Diesel shore fill valve is open', () => {
    expect(fuelSys.DieselShoreFillValve.IsOpen).toBeTruthy()
    const { status, statusMessage } = fuelSys.DieselShoreFillValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsShoreFillValve} is open`)
  })
  test('Diesel fuel line valve is open', () => {
    expect(fuelSys.DieselLineValve.IsOpen).toBeTruthy()
    const { status, statusMessage } = fuelSys.DieselLineValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsFuelLineValve} is open`)
    expect(fuelSys.DieselLineValve.Output()).toBe(0) // empty dieseltank = empty fuel line valve
  })
})

describe('Filling from shore', () => {
  test('Closing shore fill valve, adding to diesel tank then open valve', done => {
    fuelSys.DieselShoreFillValve.Close()
    const { status, statusMessage } = fuelSys.DieselShoreFillValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsShoreFillValve} is closed`)
    // wait 2 sec to get some DS in the tank
    setTimeout(() => {
      const contentBeforeClosing = fuelSys.DieselTank.Content
      fuelSys.DieselShoreFillValve.Close()
      // wait again 2 sec after opening valve, content should be changed
      setTimeout(() => {
        expect(fuelSys.DieselTank.Content).toBe(contentBeforeClosing)
      }, 2000)
      done()
    }, 2000)
  }, 150000) // jest timeout = 15 sec

  test('Closing shore fill valve, adding to diesel tank until full', done => {
    const cbFull = () => {
      // console.debug('tank is full')
      expect(fuelSys.DieselTank.Content).toBe(CstFuelSys.DsStorageTank.TankVolume)
      done()
    }
    fuelSys.DieselTank.CbFull = cbFull

    fuelSys.DieselShoreFillValve.Close()
    const { status, statusMessage } = fuelSys.DieselShoreFillValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsShoreFillValve} is closed`)
  }, 150000) // jest timeout = 15 sec
})

describe('Connect dieseltank to fuel line', () => {
  test('Close diesel fuel line valve', () => {
    fuelSys.DieselTank.Content = 2000
    fuelSys.DieselLineValve.Close()
    expect(fuelSys.DieselLineValve.Output()).toBe(2000)
    const { status, statusMessage } = fuelSys.DieselLineValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsFuelLineValve} is closed`)
  })
  test('Open a previous closed fuel line valve', () => {
    fuelSys.DieselTank.Content = 2000
    fuelSys.DieselLineValve.Close()
    fuelSys.DieselLineValve.Open()
    expect(fuelSys.DieselLineValve.Output()).toBe(0)
    const { status, statusMessage } = fuelSys.DieselLineValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsFuelLineValve} is open`)
  })
})
