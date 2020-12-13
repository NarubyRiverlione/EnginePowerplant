const { CstChanges } = require('../Cst')
module.exports = class Tank {
  constructor(Max, StartContent = 0) {
    this.Content = StartContent
    this.MaxContent = Max
    this.Adding = null // ref setInterval
    this.AddEachStep = 0
    this.Removing = null // ref setIntervel
    this.RemoveEachStep = 0
    this.CbFull = null
  }

  Add() {
    if (this.AddEachStep + this.Content < this.MaxContent) {
      this.Content += this.AddEachStep
    } else {
      // prevent overfill
      this.Content = this.MaxContent
      if (this.CbFull) this.CbFull()
    }
  }

  Remove() {
    if (this.Content - this.RemoveEachStep > 0) {
      this.Content -= this.RemoveEachStep
    } else { this.Content = 0 }
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
