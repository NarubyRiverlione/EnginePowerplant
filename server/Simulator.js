const { CstTxt } = require('./Cst')
const Power = require('./Power')

const { SimulationTxt } = CstTxt
module.exports = class Simulator {
  constructor() {
    this.IsRunning = false
    this.Power = new Power()
  }

  Update() {
    console.debug('Thick')
  }

  Start() {
    this.IsRunning = true
    return this.Status()
  }

  Stop() {
    this.IsRunning = false
    return this.Status()
  }

  Status() {
    return {
      status: this.IsRunning,
      statusMessage: this.IsRunning ? SimulationTxt.Started : SimulationTxt.Stopped
    }
  }
}
