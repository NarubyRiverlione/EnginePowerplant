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
  Interval: 1000,
  Balast: {
    Blowing: -5, // = 20 step for complete emptying balasttank
    NeededAir: 0.8, // = 80% air needed for full blow
    Filling: 10
  },
  Air: {
    Charging: 5
  },
  Depth: {
    BuoyancyFactor: 0.1 // 50 balast = 5 depth change per tick
  }
}

const CstFuelSys = {
  DS: {
    TankVolume: 1000,
    ShoreVolume: 1000000
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
