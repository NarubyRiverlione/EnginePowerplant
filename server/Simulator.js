const { CstTxt, CstActions, CstChanges } = require('./Cst')
// const Power = require('./Power')
const FuelSystem = require('./FuelSystem')

const { SimulationTxt } = CstTxt
module.exports = class Simulator {
  constructor() {
    this.Running = null // ref setIntervall
    //    this.Power = new Power()
    this.FuelSys = new FuelSystem()
  }

  Start() {
    this.Running = setImmediate(() => {
      console.debug('Thick')
      this.FuelSys.Thick()
    }, CstChanges.Interval)
    return this.Status()
  }

  Stop() {
    if (this.Running) {
      clearImmediate(this.Running)
      this.Running = null
    }
    return this.Status()
  }

  Status() {
    return {
      status: !!this.Running,
      statusMessage: this.Running ? SimulationTxt.Started : SimulationTxt.Stopped
    }
  }
}
