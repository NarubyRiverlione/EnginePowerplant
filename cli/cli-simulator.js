const { CstCmd, CstActions, CstTxt } = require('../server/Cst.js')
const { UnknownTxt, SimulationTxt } = CstTxt

const Client = require('./Client')

const client = new Client()

const Start = async () => {
  const response = await client.SimStart()
  console.log(response.statusMessage)
}
const Stop = async () => {
  const response = await client.SimStop()
  console.log(response.statusMessage)
}
const Info = async () => {
  const response = await client.SimStatus()
  console.log(response.statusMessage)
}

const Status = (rpcCmd) => {
  switch (rpcCmd) {
  case CstCmd.Start: Start(); break
  case CstCmd.Stop: Stop(); break
  case CstCmd.Info: Info(); break
  default:
    console.error(`${UnknownTxt.Cmd} for simulator: '${rpcCmd}'
      ${UnknownTxt.UseHelp}`)
  }
}

const Simulator = (rpcAction, rpcCmd) => {
  switch (rpcAction) {
  case CstActions.Status:
    Status(rpcCmd)
    break
  default:
    console.error(`${UnknownTxt.Action} for simulator: ${rpcAction}'
      ${UnknownTxt.UseHelp}`)
  }
}

module.exports = Simulator
