module.exports = class Valve {
  constructor(source, cbOpening, cbClosing) {
    // this.Input = input
    this.IsOpen = true
    this.cbNowOpen = cbOpening
    this.cbNowClosed = cbClosing
    this.Source = source
    this.Target = null
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
    const input = this.Source ? this.Source.Content : 0
    return this.IsOpen ? 0 : input
  }
}
