const grpc = require('grpc')
const path = require('path')
const protoLoader = require('@grpc/proto-loader')

const {
  CstServerIP, CstServerPort, CstTxt, CstFuelSys
} = require('../../server/Cst')
const PROTO_PATH = path.join(__dirname, '../protoc/Engine.proto')

const { PowerTxt } = CstTxt
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
  test('Fill diesel tank from shore', close => {
    grpcFuelSys.DSshoreFillValve({ OpenNow: true }, (err, response) => {
      expect(err).toBeNull()
      const { status } = response
      expect(status).toBeTruthy()

      setTimeout(() => {
        grpcFuelSys.DStankInfo({}, (err2, status2) => {
          expect(err2).toBeNull()
          const { Content } = status2
          expect(Content).not.toBe(0)
        })
        close()
      }, 2000)
    })
  }, 10000)
})
