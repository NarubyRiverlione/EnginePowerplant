const Tank = require('./Components/Tank')
const Valve = require('./Components/Valve')

const { CstFuelSys } = require('./Cst')

const showTankContent = (tank) => { console.debug(tank.Content) }

module.exports = class FuelSystem {
  constructor() {
    this.DieselTank = new Tank(CstFuelSys.DS.TankVolume)
    this.DieselTank.AddEachStep = CstFuelSys.DS.TankAddStep

    this.DieselShoreFillValve = new Valve(CstFuelSys.DS.ShoreVolume)
    this.DieselShoreFillValve.cbNowClosed = () => {
      this.DieselTank.StartAdding(() => showTankContent(this.DieselTank))
    }
  }
}
