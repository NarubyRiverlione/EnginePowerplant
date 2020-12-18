const grpc = require('grpc')
const path = require('path')
const protoLoader = require('@grpc/proto-loader')

const {
  CstServerIP, CstServerPort, CstTxt, CstFuelSys, CstCmd
} = require('../../server/Cst')
const PROTO_PATH = path.join(__dirname, '../protoc/Engine.proto')

const { FuelSysTxt } = CstTxt
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
let grpcFuelSys

beforeEach(() => {
  grpcFuelSys = new proto.FuelSys(`${CstServerIP}:${CstServerPort}`, grpc.credentials.createInsecure())
})

describe('Fuel system: Init', () => {
  test('Init: all diesel tanks are empty', () => {
    grpcFuelSys.DsStorageTankInfo({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ Content: 0, MaxContent: CstFuelSys.DsStorageTank.TankVolume })
    })
    grpcFuelSys.DsServiceTankInfo({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ Content: 0, MaxContent: CstFuelSys.DsServiceTank.TankVolume })
    })
  })
  test('Init: all diesel valves is open', () => {
    grpcFuelSys.DsShoreFillValve({ Action: CstCmd.Status }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: true, statusMessage: `${FuelSysTxt.DsShoreFillValve} is open` })
    })
    grpcFuelSys.DsStorageOutletValve({ Action: CstCmd.Status }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: true, statusMessage: `${FuelSysTxt.DsStorageOutletValve} is open` })
    })
    grpcFuelSys.DsServiceIntakeValve({ Action: CstCmd.Status }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: true, statusMessage: `${FuelSysTxt.DsServiceIntakeValve} is open` })
    })
  })
})

describe.skip('Fuel system: diesel tanks', () => {
  test('Close the diesel shore intake valve --> storage tank fills', () => {
    grpcFuelSys.DsShoreFillValve({ Action: CstCmd.Close }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: false, statusMessage: `${FuelSysTxt.DsShoreFillValve} is closed` })
    })

    // TODO do 1 Thick via Simulator of FuelSysten gRpc ??

    grpcFuelSys.DsStorageTankInfo({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({
        Content: CstFuelSys.DsStorageTank.TankAddStep,
        MaxContent: CstFuelSys.DsStorageTank.TankVolume
      })
    })
  })
})
