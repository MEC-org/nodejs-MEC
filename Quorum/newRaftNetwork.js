const async = require('async')
const exec = require('child_process').exec

const whisper = require('./Communication/whisperNetwork.js')
const util = require('./util.js')
const peerHandler = require('./peerHandler.js')
const fundingHandler = require('./fundingHandler.js')
const ports = require('./config.js').ports
const conf = require('./config.js')

function startRaftNode(result, cb){
  console.log(`[*] Starting raft node... \n[*] Network name "${conf.identity.nodeName}"`)
  let options = {encoding: 'utf8', timeout: 100*1000}
  let cmd = './node_modules/mec/Quorum/./startRaftNode.sh'
  
  cmd += ' '+conf.identity.nodeName
  cmd += ' '+ports.gethNode
  cmd += ' '+ports.gethNodeRPC
  cmd += ' '+ports.gethNodeWS_RPC
  cmd += ' '+ports.raftHttp
  if(result.networkMembership === 'permissionedNodes'){
    cmd += ' permissionedNodes' 
  } else {
    cmd += ' allowAll'
  }

  let child = exec(cmd, options)
  child.stdout.on('data', function(data){
    cb(null, result)
  })
  child.stderr.on('data', function(error){
    console.log('Start raft node ERROR:', error)
    cb(error, null)
  })
}

function startNewRaftNetwork(config, cb){
  console.log('[*] Starting new node...')

  let nodeConfig = {
    localIpAddress: config.localIpAddress,
    networkMembership: config.networkMembership,
    keepExistingFiles: config.keepExistingFiles,
    folders: ['Blockchain', `Blockchain/${conf.identity.nodeName}/geth`], 
    "web3IPCHost": `./Blockchain/${conf.identity.nodeName}/geth.ipc`,
    "web3RPCProvider": 'http://localhost:'+ports.gethNodeRPC,
    "web3WSRPCProvider": 'ws://localhost:'+ports.gethNodeWS_RPC,
    consensus: 'raft'
  }

  let seqFunction = async.seq(
    util.handleExistingFiles,
    util.generateEnode,
    util.displayEnode,
    util.handleNetworkConfiguration,
    startRaftNode,
    util.CreateWeb3Connection,
    peerHandler.ListenForNewEnodes
  )

  seqFunction(nodeConfig, function(err, res){
    if (err) { return console.log('ERROR', err) }
    console.log('[*] Done')
    cb(err, res)
  })
}

function handleStartingNewRaftNetwork(options, cb){
  config = {}
  config.localIpAddress = options.localIpAddress
  config.networkMembership = options.networkMembership
  config.keepExistingFiles = options.keepExistingFiles
  startNewRaftNetwork(config, function(err, result){
    if (err) { return console.log('ERROR', err) }
    config.raftNetwork = Object.assign({}, result)
    let networks = {
      raftNetwork: config.raftNetwork,
      communicationNetwork: config.communicationNetwork
    }
    cb(err, networks)
  })
}

exports.HandleStartingNewRaftNetwork = handleStartingNewRaftNetwork
