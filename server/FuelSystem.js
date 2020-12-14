const Tank = require('./Components/Tank')
const Valve = require('./Components/Valve')

const { CstFuelSys, CstTxt } = require('./Cst')
const { FuelSysTxt } = CstTxt

const showTankContent = (tank) => { console.debug(tank.Content) }

module.exports = class FuelSystem {
  constructor() {
    this.DieselTank = new Tank(CstFuelSys.DS.TankVolume)
    this.DieselTank.AddEachStep = CstFuelSys.DS.TankAddStep

    this.DieselShoreFillValve = new Valve(CstFuelSys.DS.ShoreVolume)
    // start adding diesel when shore intake valve is closed
    this.DieselShoreFillValve.cbNowClosed = () => {
      this.DieselTank.StartAdding(() => showTankContent(this.DieselTank))
    }
    // stop adding diesel when shore intake valve is opende
    this.DieselShoreFillValve.cbNowOpen = () => {
      this.DieselTank.StopAdding(() => showTankContent(this.DieselTank))
    }
  }

  DSintakeValveStatus() {
    return {
      status: this.DieselShoreFillValve.IsOpen,
      statusMessage: this.DieselShoreFillValve.IsOpen
        ? `${FuelSysTxt.DSintakeValve} is open`
        : `${FuelSysTxt.DSintakeValve} is closed`
    }
  }
}
