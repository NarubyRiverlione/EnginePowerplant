const FuelSystem = require('../Fuel')
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

describe('Filling from schore', () => {
  test('Closing shore fill valve, add to diesel tank', () => {
    fuelSys.DieselShoreFillValve.Close()
    expect(fuelSys.DieselTank.Content).toBe(10)
  })
})
