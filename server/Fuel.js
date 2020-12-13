const Tank = require('./Components/Tank')
const Valve = require('./Components/Valve')

const { CstFuelSys } = require('./Cst')

module.exports = class FuelSystem {
  constructor() {
    this.DieselTank = new Tank(CstFuelSys.DS.TankVolume)
    this.DieselShoreFillValve = new Valve(CstFuelSys.DS.ShoreVolume)
    this.DieselShoreFillValve.cbNowClosed = () => { this.DieselTank.Add(10) }
  }
}
