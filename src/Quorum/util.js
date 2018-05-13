const exec  = require('child_process').exec
const ps    = require('ps-node')
const fs    = require('fs');
const async = require('async')

const config   = require('./config.js')
const ports    = config.ports
const setup    = config.setup

function killallGethConstellationNode(cb){
  let cmd   = 'killall -9';
      cmd  += ' geth';
      cmd  += ' constellation-node';
  let child = exec(cmd, function(){
    cb(null, null);
  });
  child.stderr.on('data', function(error){
    console.log('ERROR:', error);
    cb(error, null);
  });
}

function clearDirectories(result, cb){
  let cmd = 'rm -rf';
  if(result.folders.includes('Blockchain') 
    && config.setup.deleteKeys === false 
    && fs.existsSync(`Blockchain/${config.identity.nodeName}/keystore`)
    && fs.existsSync(`Blockchain/${config.identity.nodeName}/geth/nodekey`)
  ){
    console.log(`[*] Backing up previous keys`)
    for(let i in result.folders){
      let folder = result.folders[i];
      cmd += ' '+folder;    
    }
    let backupKeys = `cp -r Blockchain/${config.identity.nodeName}/keystore . && cp Blockchain/${config.identity.nodeName}/geth/nodekey . && ` 
    cmd = backupKeys + cmd
  } else if(result.folders.includes('Blockchain')) {
    console.log('[*] Not backing up previous keys')
  }
  let child = exec(cmd, function(){
    cb(null, result);
  });
  child.stderr.on('data', function(error){
    console.log('ERROR:', error);
    cb(error, null);
  });
}

function createDirectories(result, cb){
  let newKeystoreFolder;
  if(
    fs.existsSync('Blockchain') &&
    fs.existsSync(`Blockchain/${config.identity.nodeName}`)
  ) {
    newKeystoreFolder = `mkdir -p Blockchain/${config.identity.nodeName}/keystore`;
  } else if (fs.existsSync('Blockchain')) {
    newKeystoreFolder = `mkdir -p Blockchain/${config.identity.nodeName}`;
    newKeystoreFolder += ` && mkdir -p Blockchain/${config.identity.nodeName}/keystore`;
  }
  // let options = {encoding: 'utf8', timeout: 10*1000};
  let child = exec(newKeystoreFolder, function(){
    cb(null, result);
  });
  child.stderr.on('data', function(error){
    console.log('ERROR:', error);
    cb(error, null);
  });
}


function hex2a(hexx) {
  for (let i = 0; i < hex.length; i += 2){
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

// TODO: Add failure after a number of retries
function waitForIPCPath(path, cb){
  if (fs.existsSync(path)) {
    cb()
  } else {
    setTimeout(function(){
      waitForIPCPath(path, cb)
    }, 1000)
  }
}

function createWeb3IPC(ipcProvider){
  let Web3IPC = require('web3_ipc');
  let options = {
    host: ipcProvider,
    ipc: true,
    personal: true,
    admin: true,
    debug: false
  };
  let web3IPC = Web3IPC.create(options);
  let web3IPCConnection = web3IPC.currentProvider.connection
  return web3IPC
}

function waitForRPCConnection(web3RPC, cb){
  web3RPC.eth.net.isListening(function(err, isListening){
    if(isListening === true){
      console.log('[INFO] RPC connection established')
      cb()
    } else {
      setTimeout(function(){
        console.log('waiting for RPC connection ...')
        waitForRPCConnection(web3RPC, cb)
      }, 1000)
    }
  })
}

// TODO: add error handler here for web3 connections so that program doesn't exit on error
function createWeb3Connection(result, cb){
  let ipcProvider = result.web3IPCHost;
  waitForIPCPath(ipcProvider, function(){
    // Web3 WS RPC
    let web3WSRPC
    if(result.web3WSRPCProvider){
      let wsProvider = result.web3WSRPCProvider;
      let Web3 = require('web3');
      web3WSRPC = new Web3(wsProvider);
      result.web3WSRPC = web3WSRPC;
    }
    // Web3 http RPC
    let httpProvider = result.web3RPCProvider;
    let Web3HttpRPC = require('web3');
    let web3HttpRPC = new Web3HttpRPC(httpProvider);
    result.web3HttpRPC = web3HttpRPC
    waitForRPCConnection(result.web3HttpRPC, function(){
      result.web3IPC = createWeb3IPC(ipcProvider)
      if(result.consensus === 'raft'){
        let Web3Raft = require('web3-raft');
        let web3HttpRaft = new Web3Raft(httpProvider);
        result.web3HttpRaft = web3HttpRaft;
      }
      console.log('[*] Node started')
      cb(null, result);
    })
  })
}

function connectToPeer(result, cb){
  let enode = result.enode;
  result.web3IPC.admin.addPeer(enode, function(err, res){
    if(err){console.log('ERROR:', err);}
    cb(null, result);
  });
}

function getNewGethAccount(result, cb, chain){
  let options = {encoding: 'utf8', timeout: 10*1000};
  let child = exec(`./node_modules/mec/src/Quorum/./geth --datadir Blockchain/${config.identity.nodeName} account new --password ./passwordfile`, options);
  child.stdout.on('data', function(data){
    if(data.indexOf('Your new account') >= 0){
      child.stdin.write('\n');
    } else if(data.indexOf('Repeat') >= 0){
      child.stdin.write('\n');
    } else if(data.indexOf('Address') == 0){
      let index = data.indexOf('{');
      let address = '0x'+data.substring(index+1, data.length-2);
      if(result.addressList == undefined){
        result.addressList = [];
      }
      result.addressList.push(address);
      cb(null, result);
    } 
  });
  child.stderr.on('data', function(error){
    if(error.indexOf('No etherbase set and no accounts found as default') < 0){
      console.log('ERROR:', error);
      cb(error, null);
    }
  });
}

function instanceAlreadyRunningMessage(processName){
  console.log('\n--- NOTE: There is an instance of '+processName+' already running.'+
    ' Please kill this instance by selecting option 5 before continuing\n')
}

function checkPreviousCleanExit(cb){
  async.parallel({
    geth: function(callback){
      ps.lookup({
        command: 'geth',
        psargs: 'ef'
      }, 
      function(err, resultList){
        callback(err, resultList)
      })
    }, 
    constellation: function(callback){
      ps.lookup({
        command: 'constellation-node',
        psargs: 'ef'
      }, 
      function(err, resultList){
        callback(err, resultList)
      })
    } 
  }, function(err, result){
    if(result && result.geth && result.geth.length > 0){
      instanceAlreadyRunningMessage('geth')
    }
    if(result && result.constellation && result.constellation.length > 0){
      instanceAlreadyRunningMessage('constellation')
    }
    cb(err, true)
  })
}

function createRaftGenesisBlockConfig(result, cb){
  let genesisTemplate = {
    "alloc": {},
    "coinbase": result.addressList[0],
    "config": {
      "homesteadBlock": 0,
      "chainId": config.chainId,
      "eip155Block": null,
      "eip158Block": null,
      "isQuorum": true
    },
    "difficulty": "0x0",
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit": "0xE0000000",
    "mixhash": "0x00000000000000000000000000000000000000647572616c65787365646c6578",
    "nonce": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
  }

  for(let key in result.addressList){
    genesisTemplate.alloc[result.addressList[key]] = {
      "balance": "100000000000000000000"
    }
  }

  let genesisConfig = JSON.stringify(genesisTemplate)

  fs.writeFile('./node_modules/mec/src/Quorum/quorum-genesis.json', genesisConfig, 'utf8', function(err, res){
    // result.communicationNetwork.genesisBlockConfigReady = true;
    cb(err, result);
  })
}

function isWeb3RPCConnectionAlive(web3RPC){
  let isAlive = false
  try{
    let accounts = web3RPC.eth.accounts
    if(accounts){
      isAlive = true
    }
  } catch(err){ } 
  return isAlive 
}

function getEnodePubKey(cb){
  let options = {encoding: 'utf8', timeout: 10*1000};
  let child = exec(`bootnode -nodekey Blockchain/${config.identity.nodeName}/geth/nodekey -writeaddress`, options)
  child.stdout.on('data', function(data){
    data = data.slice(0, -1)
    cb(null, data)
  })
  child.stderr.on('data', function(error){
    console.log('ERROR:', error)
    cb(error, null)
  })
}

function generateEnode(result, cb){
  console.log('Generating node key')
  if(result.consensus === 'raft'){
    let options = {encoding: 'utf8', timeout: 10*1000};
    let child = exec(`bootnode -genkey Blockchain/${config.identity.nodeName}/geth/nodekey`, options)
      child.stderr.on('data', function(error){
        console.log('ERROR:', error)
      })
      child.stdout.on('close', function(error){
        console.log("here 285?")
        getEnodePubKey(function(err, pubKey){
          let enode = 'enode://'+pubKey+'@'+result.localIpAddress+':'+ports.gethNode+
            '?raftport='+ports.raftHttp
          result.nodePubKey = pubKey
          result.enodeList = [enode]
          cb(null, result)
        })
      })
  } else {
    console.log('ERROR: Invalid consensus choice')
    cb(null, null)
  }
}

function displayEnode(result, cb){
  let options = {encoding: 'utf8', timeout: 10*1000};
  let child = exec(`bootnode -nodekey Blockchain/${config.identity.nodeName}/geth/nodekey -writeaddress`, options)
  child.stdout.on('data', function(data){
    data = data.slice(0, -1)
    let enode = 'enode://'+data+'@'+result.localIpAddress+':'+ports.gethNode+'?raftport='+ports.raftHttp
    console.log('\nenode:', enode+'\n')
    cb(null, result)
  })
  child.stderr.on('data', function(error){
    console.log('ERROR:', error)
    cb(error, null)
  })
}

function displayCommunicationEnode(result, cb){
  if(!result){
    return cb({error: 'parameter not defined, could not get ip address'}, null)
  }
  let options = {encoding: 'utf8', timeout: 10*1000};
  let child = exec(`bootnode -nodekey CommunicationNode/${config.identity.nodeName}/geth/nodekey -writeaddress`, options)
  child.stdout.on('data', function(data){
    data = data.slice(0, -1)
    let enode = 'enode://'+data+'@'+result.localIpAddress+':'
      +ports.communicationNode
    console.log('\n', enode+'\n')
    result.nodePubKey = data
    result.enodeList = [enode]
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
      // clearDirectories,
      createDirectories
    )
    seqFunction(result, function(err, res){
      if (err) { return console.log('ERROR', err) }
      cb(null, res)
    })
  } else {
    cb(null, result)
  }
}

function createStaticNodeFile(enodeList, cb){
  let options = {encoding: 'utf8', timeout: 100*1000};
  let list = ''
  for(let enode of enodeList){
    list += '"'+enode+'",'
  }
  list = list.slice(0, -1)
  let staticNodes = '['
    + list
    +']'
  
  fs.writeFile(`Blockchain/${config.identity.nodeName}/static-nodes.json`, staticNodes, function(err, res){
    cb(err, res);
  });
}

function getRaftConfiguration(result, cb){
  if(setup.automatedSetup){
    if(setup.enodeList){
      result.enodeList = result.enodeList.concat(setup.enodeList) 
    } 
    createStaticNodeFile(result.enodeList, function(err, res){
      // result.communicationNetwork.staticNodesFileReady = true
      cb(err, result)
    })
  } 
}

function addAddresslistToQuorumConfig(result, cb){
  if(setup.addressList && setup.addressList.length > 0){
    result.addressList = result.addressList.concat(setup.addressList) 
  } 
  if(result.communicationNetwork && result.communicationNetwork.addressList){
    result.addressList = result.addressList.concat(result.communicationNetwork.addressList) 
  }
  cb(null, result)
}

function handleNetworkConfiguration(result, cb){
  // if(result.keepExistingFiles == false){ 
    let createGenesisBlockConfig = null
    if(result.consensus === 'raft'){
      let seqFunction = async.seq(
        getRaftConfiguration,
        getNewGethAccount,
        addAddresslistToQuorumConfig,
        createRaftGenesisBlockConfig,
        // constellation.CreateNewKeys, 
        // constellation.CreateConfig
      )
      seqFunction(result, function(err, res){
        if (err) { return console.log('ERROR', err) }
        cb(null, res)
      })
    } else {
      console.log('ERROR in handleNetworkConfiguration: Unknown consensus choice')
      cb(null, null)
    }

  // } else {
  //   console.log("here???")
  //   // result.communicationNetwork.genesisBlockConfigReady = true
  //   // result.communicationNetwork.staticNodesFileReady = true
  //   cb(null, result)
  // }
}

exports.Hex2a = hex2a
exports.ClearDirectories = clearDirectories
exports.CreateDirectories = createDirectories
exports.CreateWeb3Connection = createWeb3Connection
exports.ConnectToPeer = connectToPeer
exports.KillallGethConstellationNode = killallGethConstellationNode
exports.GetNewGethAccount = getNewGethAccount
exports.CheckPreviousCleanExit = checkPreviousCleanExit
exports.CreateRaftGenesisBlockConfig = createRaftGenesisBlockConfig
exports.IsWeb3RPCConnectionAlive = isWeb3RPCConnectionAlive
exports.GenerateEnode = generateEnode
exports.DisplayEnode = displayEnode
exports.DisplayCommunicationEnode = displayCommunicationEnode
exports.handleExistingFiles = handleExistingFiles
exports.generateEnode = generateEnode
exports.displayEnode = displayEnode
exports.handleNetworkConfiguration = handleNetworkConfiguration
