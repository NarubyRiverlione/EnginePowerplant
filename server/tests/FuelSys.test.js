const FuelSystem = require('../FuelSystem')
const { CstFuelSys, CstTxt } = require('../Cst')
const { FuelSysTxt } = CstTxt

let fuelSys
beforeEach(() => {
  fuelSys = new FuelSystem()
})

describe('Fuel system init', () => {
  test('Empty diesel tank', () => {
    expect(fuelSys.DieselTank.Content()).toBe(0)
    expect(fuelSys.DieselTank.MaxContent).toBe(CstFuelSys.DsStorageTank.TankVolume)
  })
  test('Diesel shore fill valve is open', () => {
    expect(fuelSys.DieselShoreFillValve.IsOpen).toBeTruthy()
    const { status, statusMessage } = fuelSys.DieselShoreFillValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsShoreFillValve} is open`)
  })
  test('Diesel fuel storage outlet valve is open', () => {
    expect(fuelSys.DsStorageOutletValve.IsOpen).toBeTruthy()
    const { status, statusMessage } = fuelSys.DsStorageOutletValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsStorageOutletValve} is open`)
    expect(fuelSys.DsStorageOutletValve.Content()).toBe(0) // empty dieseltank = empty fuel line valve
  })
  test('Diesel fuel service intake valve is open', () => {
    expect(fuelSys.DsServiceIntakeValve.IsOpen).toBeTruthy()
    const { status, statusMessage } = fuelSys.DsServiceIntakeValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsServiceIntakeValve} is open`)
    expect(fuelSys.DsServiceIntakeValve.Content()).toBe(0) // empty dieseltank = empty fuel line valve
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
      expect(fuelSys.DieselTank.Content())
        .toBe(CstFuelSys.DsStorageTank.TankVolume)
      done()
    }
    fuelSys.DieselTank.CbFull = cbFull

    fuelSys.DieselShoreFillValve.Close()
    const { status, statusMessage } = fuelSys.DieselShoreFillValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsShoreFillValve} is closed`)
  }, 150000) // jest timeout = 15 sec
})

describe('Connect dieseltank to storage line', () => {
  test('Close diesel storage line valve', () => {
    fuelSys.DieselTank.Inside = 2000
    fuelSys.DsStorageOutletValve.Close()
    expect(fuelSys.DsStorageOutletValve.Content()).toBe(2000)
    const { status, statusMessage } = fuelSys.DsStorageOutletValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsStorageOutletValve} is closed`)
  })
  test('Open a previous closed storage line valve', () => {
    fuelSys.DieselTank.Inside = 2000
    fuelSys.DsStorageOutletValve.Close()
    fuelSys.DsStorageOutletValve.Open()
    expect(fuelSys.DsStorageOutletValve.Content()).toBe(0)
    const { status, statusMessage } = fuelSys.DsStorageOutletValve.Status()
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsStorageOutletValve} is open`)
  })
})
describe('diesel service tank', () => {
  test('Close diesel service intake valve + open storage outlet = no transfer', () => {
    fuelSys.DieselTank.Inside = 2000
    fuelSys.DsStorageOutletValve.Open()
    fuelSys.DsServiceIntakeValve.Close()
    console.debug(fuelSys.DsServiceIntakeValve.Content)
    expect(fuelSys.DsServiceIntakeValve.Content()).toBe(0)
    const { status, statusMessage } = fuelSys.DsServiceIntakeValve.Status()
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DsServiceIntakeValve} is closed`)
  })
})
