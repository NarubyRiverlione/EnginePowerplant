const FuelSystem = require('../FuelSystem')
const { CstFuelSys } = require('../Cst')

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
  })
})

describe('Filling from shore', () => {
  test('Closing shore fill valve, adding to diesel tank until full', done => {
    const cbFull = () => {
      console.debug('tank is full')
      expect(fuelSys.DieselTank.Content).toBe(CstFuelSys.DS.TankVolume)
      done()
    }
    fuelSys.DieselTank.CbFull = cbFull

    fuelSys.DieselShoreFillValve.Close()
  }, 150000) // jest timeout = 15 sec
})
