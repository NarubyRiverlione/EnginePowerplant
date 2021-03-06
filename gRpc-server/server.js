const debug = require('debug')('engine:server')
const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const {
  CstServerIP, CstServerPort, CstFuelSys, CstCmd
} = require('../server/Cst')

const Simulator = require('../server/Simulator')

const PROTO_PATH = path.join(__dirname, '/protoc/Engine.proto')

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
)

// The protoDescriptor object has the full package hierarchy
const proto = grpc.loadPackageDefinition(packageDefinition)
// initialize Engine
const simulator = new Simulator()

// #region  Simulator
const Start = (call, cb) => { cb(null, simulator.Start()) }
const Stop = (call, cb) => { cb(null, simulator.Stop()) }
const Status = (call, cb) => { cb(null, simulator.Status()) }
// #endregion

// #region Power
const PowerStatus = (call, cb) => cb(null, simulator.Power.Status())
const ConnectShore = (call, cb) => cb(null, simulator.Power.ConnectShore())
const DisconnectShore = (call, cb) => cb(null, simulator.Power.DisconnectShore())
const StartDSgen1 = (call, cb) => cb(null, simulator.Power.DSgen1.Start())
const StopDSgen1 = (call, cb) => cb(null, simulator.Power.DSgen1.Stop())
// #endregion

// #region Fuel System
const DsStorageTankInfo = (call, cb) => cb(null, {
  Content: simulator.FuelSys.DieselTank.Content(),
  MaxContent: simulator.FuelSys.DieselTank.MaxContent
})
const DsServiceTankInfo = (call, cb) => cb(null, {
  Content: simulator.FuelSys.DsServiceTank.Content(),
  MaxContent: simulator.FuelSys.DsServiceTank.MaxContent
})

const DsShoreFillValve = (call, cb) => {
  const { Action } = call.request
  if (Action.toLowerCase() === CstCmd.Open) {
    simulator.FuelSys.DieselShoreFillValve.Open()
  }
  if (Action.toLowerCase() === CstCmd.Close) {
    simulator.FuelSys.DieselShoreFillValve.Close()
  }
  const statusMsg = simulator.FuelSys.DieselShoreFillValve.Status()
  cb(null, statusMsg)
}
const DsStorageOutletValve = (call, cb) => {
  const { Action } = call.request
  if (Action.toLowerCase() === CstCmd.Open) {
    simulator.FuelSys.DsStorageOutletValve.Open()
  }
  if (Action.toLowerCase() === CstCmd.Close) {
    simulator.FuelSys.DsStorageOutletValve.Close()
  }
  const statusMsg = simulator.FuelSys.DsStorageOutletValve.Status()
  cb(null, statusMsg)
}
const DsServiceIntakeValve = (call, cb) => {
  const { Action } = call.request
  if (Action.toLowerCase() === CstCmd.Open) {
    simulator.FuelSys.DsServiceIntakeValve.Open()
  }
  if (Action.toLowerCase() === CstCmd.Close) {
    simulator.FuelSys.DsServiceIntakeValve.Close()
  }
  const statusMsg = simulator.FuelSys.DsServiceIntakeValve.Status()
  cb(null, statusMsg)
}
// #endregion

/* Starts an RPC server that receives requests
 first argument = server IP
 second argument = server port
 */
const server = () => {
  const Args = process.argv
  const serverIP = Args[2] || CstServerIP
  const serverPort = Args[3] || CstServerPort

  const gRpcServer = new grpc.Server()
  gRpcServer.addService(proto.Simulator.service, { Start, Stop, Status })
  gRpcServer.addService(proto.Power.service, {
    Status: PowerStatus,
    ConnectShore,
    DisconnectShore,
    StartDSgen1,
    StopDSgen1
  })
  gRpcServer.addService(proto.FuelSys.service, {
    DsStorageTankInfo,
    DsServiceTankInfo,
    DsShoreFillValve,
    DsStorageOutletValve,
    DsServiceIntakeValve

  })

  gRpcServer.bind(`${serverIP}:${serverPort}`, grpc.ServerCredentials.createInsecure())
  gRpcServer.start()
}

server()
