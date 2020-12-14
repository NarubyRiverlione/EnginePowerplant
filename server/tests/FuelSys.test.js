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
    expect(fuelSys.DieselTank.MaxContent).toBe(CstFuelSys.DS.TankVolume)
  })
  test('Diesel shore fill valve is open', () => {
    expect(fuelSys.DieselShoreFillValve.IsOpen).toBeTruthy()
    const valveStatus = fuelSys.DSintakeValveStatus()
    const { status, statusMessage } = valveStatus
    expect(status).toBeTruthy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DSintakeValve} is open`)
  })
})

describe('Filling from shore', () => {
  test.only('Closing shore fill valve, adding to diesel tank then open valve', done => {
    fuelSys.DieselShoreFillValve.Close()
    const valveStatus = fuelSys.DSintakeValveStatus()
    const { status, statusMessage } = valveStatus
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DSintakeValve} is closed`)
    // wait 2 sec to get some DS in the tank
    setTimeout(() => {
      const contentBeforClosing = fuelSys.DieselTank.Content
      fuelSys.DieselShoreFillValve.Close()
      // wait again 2 sec after opening valve, content should be changed
      setTimeout(() => {
        expect(fuelSys.DieselTank.Content).toBe(contentBeforClosing)
      }, 2000)
      done()
    }, 2000)
  }, 150000) // jest timeout = 15 sec

  test('Closing shore fill valve, adding to diesel tank until full', done => {
    const cbFull = () => {
      // console.debug('tank is full')
      expect(fuelSys.DieselTank.Content).toBe(CstFuelSys.DS.TankVolume)
      done()
    }
    fuelSys.DieselTank.CbFull = cbFull

    fuelSys.DieselShoreFillValve.Close()
    const valveStatus = fuelSys.DSintakeValveStatus()
    const { status, statusMessage } = valveStatus
    expect(status).toBeFalsy()
    expect(statusMessage).toEqual(`${FuelSysTxt.DSintakeValve} is closed`)
  }, 150000) // jest timeout = 15 sec
})
