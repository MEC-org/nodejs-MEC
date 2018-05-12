const async = require('async')
const exec = require('child_process').exec
const fs = require('fs')

const whisper = require('./Communication/whisperNetwork.js')
const util = require('./util.js')
const peerHandler = require('./peerHandler.js')
const fundingHandler = require('./fundingHandler.js')
const ports = require('./config.js').ports
const setup = require('./config.js').setup
const conf  = require('./config.js')

function startRaftNode(result, cb){
  let options = {encoding: 'utf8', timeout: 100*1000}
  let cmd = './node_modules/mec/src/Quorum/./startRaftNode.sh'
  cmd += ' ' + conf.identity.nodeName
  cmd += ' ' + ports.gethNode
  cmd += ' ' + ports.gethNodeRPC
  cmd += ' ' + ports.gethNodeWS_RPC
  cmd += ' ' + ports.raftHttp
  if(result.networkMembership === 'permissionedNodes'){
    cmd += ' permissionedNodes' 
  } else {
    cmd += ' allowAll'
  }
  cmd += ' '+result.communicationNetwork.raftID
  // init blockchain folder before running 
  // exec(`./Quorum/./geth --datadir Blockchain/${conf.identity.nodeName} init ./Quorum/quorum-genesis.json &>> /dev/null`)
  let child = exec(cmd, options)
  child.stdout.on('data', function(data){
    cb(null, result)
  })
  child.stderr.on('data', function(error){
    console.log('ERROR:', error)
    cb(error, null)
  })
}

function handleExistingFiles(result, cb){
  if(result.keepExistingFiles == false){ 
    let seqFunction = async.seq(
      util.ClearDirectories,
      util.CreateDirectories,
      util.GetNewGethAccount,
      util.GenerateEnode,    
      util.DisplayEnode
    )
    seqFunction(result, function(err, res){
      if (err) { return console.log('ERROR', err) }
      cb(null, res)
    })
  } else {
    cb(null, result)
  }
}

function handleNetworkConfiguration(result, cb){
  if(result.keepExistingFiles == false){ 
    let seqFunction = async.seq(
      whisper.RequestExistingRaftNetworkMembership,
      whisper.GetGenesisBlockConfig,
      whisper.GetStaticNodesFile
    )
    seqFunction(result, function(err, res){
      if (err) { return console.log('ERROR', err) }
      cb(null, res)
    })
  } else {
    fs.readFile(`Blockchain/${conf.identity.nodeName}/raftID`, function(err, data){
      result.communicationNetwork.raftID = data 
      cb(null, result)
    })
  }
}

function joinRaftNetwork(config, cb){
  console.log('[*] Starting new network...')

  let nodeConfig = {
    localIpAddress: config.localIpAddress,
    remoteIpAddress : config.remoteIpAddress, 
    keepExistingFiles: config.keepExistingFiles,
    folders: ['Blockchain', `Blockchain/${conf.identity.nodeName}/geth`], 
    "web3IPCHost": `./Blockchain/${conf.identity.nodeName}/geth.ipc`,
    "web3RPCProvider": 'http://localhost:'+ports.gethNodeRPC,
    "web3WSRPCProvider": 'ws://localhost:'+ports.gethNodeWS_RPC,
    consensus: 'raft'
  }

  let seqFunction = async.seq(
    handleExistingFiles,
    handleNetworkConfiguration,
    startRaftNode,
    util.CreateWeb3Connection,
    whisper.AddEnodeResponseHandler,
    peerHandler.ListenForNewEnodes,
    whisper.AddEnodeRequestHandler,
    fundingHandler.MonitorAccountBalances,
    whisper.PublishNodeInformation
  )

  seqFunction(nodeConfig, function(err, res){
    if (err) { return console.log('ERROR', err) }
    console.log('[*] New network started')
    cb(err, res)
  })
}

function getRemoteIpAddress(cb, ipAddress){
  if(setup.automatedSetup === true){
    cb(setup.remoteIpAddress)
  } else {
    console.log('In order to join the network, please enter the ip address of the coordinating node')
    // prompt.get(['ipAddress'], function (err, network) {
    //   cb(network.ipAddress)
    // })
  } 
}

function handleJoiningRaftNetwork(options, cb){
  config = {}
  config.localIpAddress = options.localIpAddress
  config.keepExistingFiles = options.keepExistingFiles
  getRemoteIpAddress(function(remoteIpAddress){
    config.remoteIpAddress = remoteIpAddress
    joinRaftNetwork(config, function(err, result){
      if (err) { return console.log('ERROR', err) }
      let networks = {
        raftNetwork: Object.assign({}, result),
        communicationNetwork: config.communicationNetwork
      }
      cb(err, networks)
    })
  })
}

exports.HandleJoiningRaftNetwork = handleJoiningRaftNetwork
