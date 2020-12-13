const CstServerIP = '0.0.0.0'
const CstServerPort = 9090

const CstService = {
  Air: 'air',
  Power: 'power',
  Fuel: 'fuel',
  Help: 'help',
  Coolant: 'coolant',
  Simulation: 'sim'
}

const CstActions = {
  Status: 'status',
  Reset: 'reset',
  Shore: 'shore',
  DSgen1: 'dsgen1'
}

const CstCmd = {
  Start: 'start',
  Stop: 'stop',
  Info: 'info',
  Connect: 'connect',
  Disconnect: 'disconnect'
}

const CstTxt = {
  HelpTxt: `
  Control the engine via the 'station' 'action' 'command'
      * Stations *        * Actions *             * Commands *
      ${CstService.Simulation}    ${CstActions.Status}    ${CstCmd.Info} 
      ${CstService.Simulation}    ${CstActions.Status}    ${CstCmd.Start} 
      ${CstService.Simulation}    ${CstActions.Status}    ${CstCmd.Stop} 
    
      General action for all stations: ${CstActions.Info}  
      `,
  UnknownTxt: {
    Service: 'Unknown station',
    Action: 'Unknown action',
    Cmd: 'Unknown command',
    UseHelp: 'use \'cli  help\' for more information'
  },

  SimulationTxt: {
    Stopped: 'Simulation not running',
    Started: 'Simulation is running'
  },
  PowerTxt: {
    Connected: 'connected',
    Disconnected: 'disconnected',
    Running: 'running',
    NotRunning: 'not running'
  }
}

const CstBoundaries = {
  Power: { Max: 440, Min: 0 }
}

const CstChanges = {
  TankInterval: 1000
}

const CstFuelSys = {
  DS: {
    TankVolume: 2500,
    ShoreVolume: 1000000,
    TankAddStep: 500
  }
}

module.exports = {
  CstCmd,
  CstService,
  CstServerIP,
  CstServerPort,
  CstBoundaries,
  CstChanges,
  CstActions,
  CstTxt,
  CstFuelSys
}
