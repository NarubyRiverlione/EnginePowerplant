const { CstCmd, CstActions, CstTxt } = require('../server/Cst.js')
const { UnknownTxt, PowerTxt } = CstTxt

const Client = require('./Client')

const client = new Client()

const ShowPowerStatus = status => {
  console.log(`Mainbus = ${status.MainBus}  Volts,
  Shore power is ${status.ShorePower ? PowerTxt.Connected : PowerTxt.Disconnected}
  Diesel generator 1 is ${status.DSgen1 ? PowerTxt.Connected : PowerTxt.Disconnected}
  `)
}
const ShowRunningStatus = status => {
  console.log(`${status.Running ? PowerTxt.Running : PowerTxt.NotRunning}
  ${status.Message}`)
}

const GetStatus = async () => {
  const response = await client.PowerStatus()
  ShowPowerStatus(response)
}
// #region  DS Gen 1
const DSgen1Start = async () => {
  const response = await client.StartDSgen1()
  ShowRunningStatus(response)
}
const DSgen1Stop = async () => {
  const response = await client.StopDSgen1()
  ShowRunningStatus(response)
}
const DSgen1 = rpcCmd => {
  switch (rpcCmd) {
  case CstCmd.Start:
    DSgen1Start()
    break
  case CstCmd.Stop:
    DSgen1Stop()
    break
  default:
    console.error(`${UnknownTxt.Cmd} for power station - DS gen 1: ${rpcCmd} '
    ${UnknownTxt.UseHelp} `)
  }
}
// #endregion

// #region  Shore
const ShoreDisconnect = async () => {
  const response = await client.PowerShoreDisconnect()
  ShowPowerStatus(response)
}
const ShoreConnect = async () => {
  const response = await client.PowerShoreConnect()
  ShowPowerStatus(response)
}
const Shore = (rpcCmd) => {
  switch (rpcCmd) {
  case CstCmd.Connect:
    ShoreConnect()
    break
  case CstCmd.Disconnect:
    ShoreDisconnect()
    break
  default:
    console.error(`${UnknownTxt.Cmd} for power station - Shore: ${rpcCmd} '
${UnknownTxt.UseHelp} `)
  }
}
// #endregion

const Power = (rpcAction, rpcCmd) => {
  switch (rpcAction) {
  case CstActions.Shore:
    Shore(rpcCmd)
    break
  case CstActions.Status:
    GetStatus()
    break
  case CstActions.DSgen1:
    DSgen1(rpcCmd)
    break
  default:
    console.error(`${UnknownTxt.Action} for power station: ${rpcAction} '
${UnknownTxt.UseHelp} `)
  }
}

module.exports = Power
