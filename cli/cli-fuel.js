const { CstCmd, CstActions, CstTxt } = require('../server/Cst.js')
const { UnknownTxt, PowerTxt } = CstTxt

const Client = require('./Client')
const client = new Client()

const DStankInfo = async () => {
  const response = await client.DStankInfo()
  console.log(`Diesel tank content: ${response.Content}/${response.MaxContent}`)
}

const DSintankValve = async (rpcCmd) => {
  const response = await client.DSshoreFillValve(rpcCmd)
  console.log(response.statusMessage)
}

const FuelSys = (rpcAction, rpcCmd) => {
  switch (rpcAction.toLowerCase()) {
    case CstActions.DieselTank:
      DStankInfo()
      break
    case CstActions.DieselIntakeValve:
      DSintankValve(rpcCmd)
      break
    default:
      console.error(`${UnknownTxt.Action} for fuel system: ${rpcAction} '
  ${UnknownTxt.UseHelp} `)
  }
}

module.exports = FuelSys
