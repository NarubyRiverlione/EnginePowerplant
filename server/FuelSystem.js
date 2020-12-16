const Tank = require('./Components/Tank')
const Valve = require('./Components/Valve')

const { CstFuelSys, CstTxt } = require('./Cst')
const { FuelSysTxt } = CstTxt

const showTankContent = (tank) => { console.debug(tank.Content()) }

module.exports = class FuelSystem {
  constructor() {
    // #region Diesel storage tank, filled from shore via the intake valve
    this.DieselTank = new Tank(CstFuelSys.DsStorageTank.TankVolume)
    this.DieselTank.Name = FuelSysTxt.DsStorage
    this.DieselTank.AddEachStep = CstFuelSys.DsStorageTank.TankAddStep
    // #endregion

    // #region Diesel service tank, filled from the storage line via the service intake valve
    this.DsServiceTank = new Tank(CstFuelSys.DsServiceTank.TankVolume)
    this.DsServiceTank.Name = FuelSysTxt.DsServiceTank
    // #endregion

    // #region Intake valve from shore to diesel storage tank
    this.DieselShoreFillValve = new Valve({ Content: CstFuelSys.ShoreVolume })
    this.DieselShoreFillValve.Name = FuelSysTxt.DsShoreFillValve
    this.DieselShoreFillValve.cbNowClosed = () => {
      this.DieselTank.StartAdding() /// (() => showTankContent(this.DieselTank))
    }
    this.DieselShoreFillValve.cbNowOpen = () => {
      this.DieselTank.StopAdding() // (() => showTankContent(this.DieselTank))
    }
    // #endregion

    // #region Outlet valve from diesel storage tank to storage line
    this.DsStorageOutletValve = new Valve(this.DieselTank)
    this.DsStorageOutletValve.Name = FuelSysTxt.DsStorageOutletValve
    this.DsStorageOutletValve.cbNowClosed = () => {
      // only transfer from storage to service tank
      // if this outlet and service inlet valve are both is closed
      if (!this.DsServiceIntakeValve.IsOpen) { this.DieselTank.StartRemoving(() => showTankContent(this.DieselTank)) }
    }
    // as both outlet valves and service intake valve needs to be open to transfer
    // and this outlet  is now closing --> stop transfer
    this.DsStorageOutletValve.cbNowOpen = () => {
      this.DieselTank.StopRemoving() // (() => showTankContent(this.DieselTank))
    }
    // #endregion

    // #region Intake service valve
    this.DsServiceIntakeValve = new Valve(this.DsStorageOutletValve)
    this.DsServiceIntakeValve.Name = FuelSysTxt.DsServiceIntakeValve
    this.DsServiceIntakeValve.cbNowClosed = () => {
      // only transfer from storage to service tank
      // if the outlet storage and this service inlet valve are both closed
      if (!this.DsStorageOutletValve.IsOpen) this.DieselTank.StartRemoving()
    }
    // as both outlet valves and service intake valve needs to be open to transfer
    // and this inlet  is now closing --> stop transfer
    this.DsServiceIntakeValve.cbNowOpen = () => {
      this.DieselTank.StopRemoving() // (() => showTankContent(this.DieselTank))
    }
    // #endregion
  }
}
