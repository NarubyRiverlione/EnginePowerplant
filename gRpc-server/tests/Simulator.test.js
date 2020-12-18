const grpc = require('grpc')
const path = require('path')
const protoLoader = require('@grpc/proto-loader')

const { CstServerIP, CstServerPort, CstTxt } = require('../../server/Cst')
const PROTO_PATH = path.join(__dirname, '../protoc/Engine.proto')

const { SimulationTxt } = CstTxt
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
let grpcSimulator

beforeEach(() => {
  grpcSimulator = new proto.Simulator(`${CstServerIP}:${CstServerPort}`, grpc.credentials.createInsecure())
})

describe('Simulator init', () => {
  test('Init status', done => {
    grpcSimulator.Status({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ status: false, statusMessage: SimulationTxt.Stopped })
      done()
    })
  })
})
describe('Start/stop simulator', () => {
  test('Start simulator', done => {
    grpcSimulator.Start({}, (err, status) => {
      expect(err).toBeNull()
      expect(status).toEqual({ status: true, statusMessage: SimulationTxt.Started })
      done()
    })
  })
  test('Stop simulator', done => {
    grpcSimulator.Start({}, (err, status) => {
      expect(err).toBeNull()
      grpcSimulator.Stop({}, (err2, status2) => {
        expect(err2).toBeNull()
        expect(status2).toEqual({ status: false, statusMessage: SimulationTxt.Stopped })
        done()
      })
    })
  })
})
