const exec = require('child_process').exec;
const Web3Gen = require('./Web3Generator.js');
// const manager = require('./accManag.js').Accounts
const keys = require('../appStructure/keyElements.js')
const path = "./node_modules/mec/"
// const fs = require('fs');

function Chain(network) {
  return new Promise((resolve,reject)=>{
    let init = `${path}./MEC --datadir .chainData/${network} init ${path}./genesis.json`;
    execute(init).then((log)=>{
      console.log(log);
      console.log('Successfully created new chain folder')
      // not importing account and this time
      keys.accounts.importAccount(network)
      resolve(true);
    })
    .catch((err)=>{
      console.log(err);
      reject(err);
    })
  });
}

function Client(network, chainId, port, discovery, rpcswitch) {
  return new Promise((resolve,reject)=>{
    let rpc;
    if (rpcswitch) rpc = `--rpc --rpcapi "web3,eth,net" --rpcport ${port} --rpccorsdomain "*"`;
    else rpc = '';
    let bin = `${path}./MEC --datadir .chainData/${network} --port ${discovery} ${rpc} --networkid ${chainId} --nodiscover --verbosity "0" --ipcpath ".chainData/${network}/./MEC.ipc"`;
    execute(bin);
    setTimeout(()=>{
      resolve(true);
    }, 1000);

  });
}

function newWeb3Provider(path) {
  return Web3Gen.newRemoteProvider(path)
}

function execute(command){
  return new Promise((resolve,reject)=>{
    exec(command, function(error, stdout, stderr){
      if(error) reject(error);
      else if(stdout) resolve(stdout);
      else if(stderr) resolve(stderr);
    });
  });
}

module.exports = {
	Chain,
	Client,
  newWeb3Provider,
  execute
}
