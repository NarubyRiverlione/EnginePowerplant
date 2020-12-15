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

describe('Fuel system', () => {
  test('Init: empty diesel tank', () => {
    grpcFuelSys.DStankInfo({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ Content: 0, MaxContent: CstFuelSys.DS.TankVolume })
    })
  })
  test('Init: diesel shore intake valve is open', () => {
    grpcFuelSys.DSshoreFillValve({ Action: CstCmd.Open }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: true, statusMessage: `${FuelSysTxt.DieselShoreFillValve} is open` })
    })
  })
  test('Init: diesel fuel line  valve is open', () => {
    grpcFuelSys.DSshoreFillValve({ Action: CstCmd.Open }, (err, response) => {
      expect(err).toBeNull()
      expect(response).toEqual({ status: true, statusMessage: `${FuelSysTxt.DieselLineValve} is open` })
    })
  })
  test.skip('Fill diesel tank from shore', close => {
    grpcFuelSys = new proto.FuelSys(`${CstServerIP}:${CstServerPort}`, grpc.credentials.createInsecure())
    grpcFuelSys.DSshoreFillValve({ Action: CstCmd.Close }, (err, response) => {
      expect(err).toBeNull()
      const { status } = response
      expect(status).toBeFalsy()

      setTimeout(() => {
        grpcFuelSys.DStankInfo({}, (err2, status2) => {
          expect(err2).toBeNull()
          const { Content } = status2
          console.debug(status2)
          expect(Content).not.toBe(0)
          close()
        })
      }, 3000)
    })
  }, 10000)
})
