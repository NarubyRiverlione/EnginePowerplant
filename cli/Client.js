const debug = require('debug')('engine:client')
const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const { CstServerIP, CstServerPort } = require('../server/Cst')
const PROTO_PATH = path.join(__dirname, '/../gRpc-server/protoc/Engine.proto')

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

module.exports = class Client {
  constructor(serverIP = CstServerIP, serverPort = CstServerPort) {
    debug(`connecting to ${serverIP} on port ${serverPort}`)
    this.Simulator = new proto.Simulator(`${serverIP}:${serverPort}`, grpc.credentials.createInsecure())
    this.Power = new proto.Power(`${serverIP}:${serverPort}`, grpc.credentials.createInsecure())
    this.FuelSys = new proto.FuelSys(`${serverIP}:${serverPort}`, grpc.credentials.createInsecure())
  }

  // #region  Simulator
  SimStart() {
    return new Promise((resolve, reject) => {
      this.Simulator.Start({}, (err, respone) => {
        if (err) {
          return reject(err)
        }
        return resolve(respone)
      })
    })
  }

  SimStop() {
    return new Promise((resolve, reject) => {
      this.Simulator.Stop({}, (err, respone) => {
        if (err) {
          return reject(err)
        }
        return resolve(respone)
      })
    })
  }

  SimStatus() {
    return new Promise((resolve, reject) => {
      this.Simulator.Status({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }
  // #endregion

  // #region Power
  PowerStatus() {
    return new Promise((resolve, reject) => {
      this.Power.Status({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  PowerShoreConnect() {
    return new Promise((resolve, reject) => {
      this.Power.ConnectShore({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  PowerShoreDisconnect() {
    return new Promise((resolve, reject) => {
      this.Power.DisconnectShore({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  StartDSgen1() {
    return new Promise((resolve, reject) => {
      this.Power.StartDSgen1({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  StopDSgen1() {
    return new Promise((resolve, reject) => {
      this.Power.StopDSgen1({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  // #endregion
  // #region Fuel System
  DStankInfo() {
    return new Promise((resolve, reject) => {
      this.FuelSys.DStankInfo({}, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }

  DSshoreFillValve(Action) {
    return new Promise((resolve, reject) => {
      this.FuelSys.DSshoreFillValve({ Action }, (err, respone) => {
        if (err) { return reject(err) }
        return resolve(respone)
      })
    })
  }
  // #endregion
}
