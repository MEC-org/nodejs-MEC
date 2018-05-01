//TODO: These can be overwritten with commandline variables passed when running setupFromConfig

let env = process.env
let config = {}

config.chainId = 4058

config.ports = {}
config.ports.communicationNode = 50000
config.ports.remoteCommunicationNode = 50000
config.ports.communicationNodeRPC = 50010
config.ports.communicationNodeWS_RPC = 50020
config.ports.gethNode = 20000 // Changing this will change the raftHttp port!
config.ports.gethNodeRPC = 20010
config.ports.gethNodeWS_RPC = 20020
config.ports.raftHttp = config.ports.gethNode + 20000  // This is a requirement from raftHttp!
config.ports.devp2p = 30303
config.ports.constellation = 9000

config.identity = {}

config.whisper = {}
config.whisper.symKeyPassword = 'networkBootstrapPassword'
config.whisper.symKeyID = null
config.whisper.asymKeyID = null
config.whisper.id = null
config.whisper.powTime = 1
config.whisper.powTarget = 0.5

// Change these for different setups. 
config.setup = {}
// Enter ip address as a string
config.setup.localIpAddress = env.IP ? env.IP : '127.0.0.1'
// Only allowAll for now
config.setup.networkMembership = 'allowAll'
// Options are true or false
config.setup.keepExistingFiles = (env.KEEP_FILES == 'true')
// Only raft supported for now
config.setup.consensus = 'raft'
// Enodes that will be written to static-nodes.json if coordinator, comma separated strings
config.setup.enodeList = env.ENODE_LIST ? env.ENODE_LIST : []
// Accounts that will be written to the genesis config if coordinator, comma separated strings
config.setup.addressList = env.ADDRESS_LIST ? env.ADDRESS_LIST : []
// Address of the coordinator, used if this node is not the coordinator
config.setup.remoteIpAddress = env.COORDINATING_IP ? env.COORDINATING_IP : '127.0.0.1'
// This is changed to true if setupFromConfig.js is used
config.setup.automatedSetup = false

module.exports = config
