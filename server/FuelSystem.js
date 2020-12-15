const Tank = require('./Components/Tank')
const Valve = require('./Components/Valve')

const { CstFuelSys, CstTxt } = require('./Cst')
const { FuelSysTxt } = CstTxt

const showTankContent = (tank) => { console.debug(tank.Content) }

module.exports = class FuelSystem {
  constructor() {
    this.DieselTank = new Tank(CstFuelSys.DsStorage.TankVolume)
    this.DieselTank.AddEachStep = CstFuelSys.DsStorage.TankAddStep

    this.DsServiceTank = new Tank(CstFuelSys.DsService.TankVolume)

    this.DieselShoreFillValve = new Valve({ Content: CstFuelSys.ShoreVolume })
    // start adding diesel when shore intake valve is closed
    this.DieselShoreFillValve.cbNowClosed = () => {
      this.DieselTank.StartAdding(() => showTankContent(this.DieselTank))
    }
    // stop adding diesel when shore intake valve is opende
    this.DieselShoreFillValve.cbNowOpen = () => {
      this.DieselTank.StopAdding(() => showTankContent(this.DieselTank))
    }

    this.DieselLineValve = new Valve(this.DieselTank)
    this.DieselLineValve.cbNowClosed = () => {
      this.DieselTank.StartRemoving(() => showTankContent(this.DieselTank))
    }
    this.DieselLineValve.cbNowOpen = () => {
      this.DieselTank.StopRemoving(() => showTankContent(this.DieselTank))
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
