module.exports = class Valve {
  constructor(input = 0, cbOpening, cbClosing) {
    this.Input = input
    this.IsOpen = true
    this.cbNowOpen = cbOpening
    this.cbNowClosed = cbClosing
  }

  Open() {
    this.IsOpen = true
    if (this.cbNowOpen) this.cbNowOpen()
  }

  Close() {
    this.IsOpen = false
    if (this.cbNowClosed) this.cbNowClosed()
  }

  Output() {
    return this.IsOpen ? 0 : this.Input
  }
}
