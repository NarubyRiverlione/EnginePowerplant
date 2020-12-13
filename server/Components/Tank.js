module.exports = class Tank {
  constructor(Max, StartContent = 0) {
    this.Content = StartContent
    this.MaxContent = Max
    this.Adding = null
    this.Removing = null
  }

  Add(adding) {
    if (adding + this.Content < this.MaxContent) {
      this.Content += adding
    } else {
      // prevent overfill
      this.Content = this.MaxContent
      if (this.Adding) this.StopAdding()
    }
  }

  Remove(removing) {
    if (this.Content - removing > 0) {
      this.Content -= removing
    } else { this.Content = 0 }
  }

  StartAdding(addEachStep, cbAdded) {
    this.Adding = setInterval(() => {
      this.Add(addEachStep)
      if (cbAdded) cbAdded()
    }, 500)
  }

  StopAdding() {
    clearInterval(this.Adding)
    this.Adding = null
  }
}
