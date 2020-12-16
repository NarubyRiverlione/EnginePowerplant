const { CstChanges } = require('../Cst')
module.exports = class Tank {
  constructor(Max, StartContent = 0) {
    this.Inside = StartContent
    this.MaxContent = Max
    this.Adding = null // ref setInterval
    this.AddEachStep = 0
    this.Removing = null // ref setIntervel
    this.RemoveEachStep = 0
    this.CbFull = null
    this.Name = ''
  }

  Content() {
    return this.Inside
  }

  Add() {
    if (this.AddEachStep + this.Inside < this.MaxContent) {
      this.Inside += this.AddEachStep
    } else {
      // prevent overfill
      this.Inside = this.MaxContent
      if (this.CbFull) this.CbFull()
    }
  }

  Remove() {
    if (this.Inside - this.RemoveEachStep > 0) {
      this.Inside -= this.RemoveEachStep
    } else { this.Inside = 0 }
  }

  StartAdding(cbAdded) {
    this.Adding = setInterval(() => {
      this.Add()
      if (cbAdded) cbAdded()
    }, CstChanges.TankInterval)
  }

  StopAdding() {
    if (this.Adding) {
      clearInterval(this.Adding)
      this.Adding = null
    }
  }

  StartRemoving(cbRemoved) {
    this.Removing = setInterval(() => {
      this.Remove()
      if (cbRemoved) cbRemoved()
    }, CstChanges.TankInterval)
  }

  StopRemoving() {
    if (this.Removing) {
      clearInterval(this.Removing)
      this.Removing = null
    }
  }
}
