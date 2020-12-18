const grpc = require('grpc')
const path = require('path')
const protoLoader = require('@grpc/proto-loader')

const {
  CstServerIP, CstServerPort, CstTxt, CstBoundaries
} = require('../../server/Cst')
const { doesNotMatch } = require('assert')
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
const grpcPower = new proto.Power(`${CstServerIP}:${CstServerPort}`, grpc.credentials.createInsecure())

describe('Power system init', () => {
  test('No power at start', done => {
    grpcPower.Status({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ MainBus: 0, ShorePower: false, DSgen1: false })
      done()
    })
  })
})

describe('Shore power', () => {
  test('Connect Shore power', done => {
    grpcPower.ConnectShore({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ MainBus: CstBoundaries.Power.Max, ShorePower: true, DSgen1: false })
      done()
    })
  })
  test('Disconnect Shore power', done => {
    grpcPower.ConnectShore({}, (err, status) => {
      expect(err).toBeNull()
      grpcPower.DisconnectShore({}, (err2, status2) => {
        expect(err2).toBeNull()
        expect(status2).toEqual({ MainBus: 0, ShorePower: false, DSgen1: false })
        done()
      })
    })
  })
})
