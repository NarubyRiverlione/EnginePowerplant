const Simulator = require('./cli-simulator')
const Power = require('./cli-power')

const { CstService, CstTxt } = require('../server/Cst')
const { UnknownTxt, HelpTxt } = CstTxt

const Args = process.argv
// console.log(Args)
const rpcService = Args[2] ? Args[2].toLowerCase() : null
const rpcAction = Args[3] ? Args[3].toLowerCase() : null
const rpcCmd = Args[4] ? Args[4].toLowerCase() : null
const rpcValue = Args[5] || null

switch (rpcService) {
case CstService.Simulation:
  Simulator(rpcAction, rpcCmd)
  break
case CstService.Power:
  Power(rpcAction, rpcCmd)
  break
case CstService.Help:
  console.log(HelpTxt)
  break
default:
  console.error(`${UnknownTxt.Service}: ${rpcService}  ${UnknownTxt.UseHelp}`)
}
